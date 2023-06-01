import {
  Button,
  TextField,
} from "@mui/material";
import { FC, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreateProjectMutation, useGetMinibackQuery } from '../../services';
import { useAppSelector } from "../../store/hooks";
import {
  ButtonsContainer,
  Container,
  FileInput,
  FormContainer,
  FormControl,
  FormControlPorts,
  FormHelperText,
  InputField,
  ProjectOptionsContainer,
  Section,
  SectionHeader,
  SectionInputs,
  SectionInputsPort,
  SelectProjectsContainer
} from "./project.styles";

interface IProject {
  name: string,
  email: string,
  gitLink: string,
  envFile: FileList,
  sshGitPrivateKey: FileList,
  port: string[];
}

export const Project: FC = () => {
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<IProject>({
    defaultValues: {
      port: [" "],
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: "port"
  });
  const { email } = useAppSelector((state: { auth: any; }) => state.auth)
  const navigate = useNavigate()
  const location = useLocation()
  const miniBackId = location.pathname.split('/')[2]
  const { data: miniback } = useGetMinibackQuery({ id: miniBackId })
  const [createProject] = useCreateProjectMutation()

  const envFile = watch('envFile');
  const sshGitPrivateKey = watch('sshGitPrivateKey')

  const onSubmit = async (data: IProject) => {
    console.log(data)
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('port', JSON.stringify(data.port))
    formData.append('gitLink', data.gitLink)
    formData.append('envFile', data.envFile[0])
    formData.append('sshGitPrivateKey', data.sshGitPrivateKey[0])
    createProject({
      body: formData, serverUrl: miniback?.serverUrl, port: miniback?.port
    })
      .catch(e => console.log(e))
      .finally(() => navigate(`/mini-back/${miniBackId}`))
  }

  const comeBack = (): void => {
    navigate(`/mini-back/${miniBackId}`)
  }


  console.log(fields)
  return (
    <Container>
      <FormContainer>
        <ProjectOptionsContainer>
          <Section>
            <SectionHeader>Your data</SectionHeader>
            <SectionInputs>
              <FormControl>
                <TextField
                  label="Name"
                  focused
                  error={!!errors.name}
                  required
                  size="small"
                  {...register("name", {
                    required: 'Name is required',
                    maxLength: 49
                  })}
                />
                {errors.name && (
                  <FormHelperText>{errors.name.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl>
                <TextField
                  label="Email"
                  size="small"
                  type="email"
                  error={!!errors.email}
                  defaultValue={email}
                  inputProps={{ readOnly: true }}
                  {...register("email", {
                    maxLength: 63,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please Enter a valid Email!"
                    }
                  })}
                />
                {errors.email && (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                )}
              </FormControl>
            </SectionInputs>
          </Section>
          <Section>
            <SectionHeader>Git data</SectionHeader>
            <SectionInputs>
              <FormControl>
                <TextField
                  label="Git link"
                  size="small"
                  required
                  error={!!errors.gitLink}
                  focused
                  {...register('gitLink', {
                    required: 'Git link is required',
                    maxLength: 2047
                  })}
                />
                {errors.gitLink && <FormHelperText>
                  {errors.gitLink.message}
                </FormHelperText>}
              </FormControl>
              <FormControl>
                <Button
                  component="label"
                  variant="outlined"
                >
                  SSH Git private key
                  <FileInput
                    id="ssh-git-private-key"
                    type="file"
                    style={{ display: "none" }}
                    {...register('sshGitPrivateKey', {
                      required: 'SSH git private key is required',
                    })}
                  />
                </Button>
                {!errors.sshGitPrivateKey?.message && sshGitPrivateKey &&
                  !!sshGitPrivateKey.length && (
                    <FormHelperText>
                      File: {sshGitPrivateKey[0].name}
                    </FormHelperText>
                  )}
                {errors.sshGitPrivateKey && <FormHelperText>
                  {errors.sshGitPrivateKey.message}
                </FormHelperText>
                }
              </FormControl>
            </SectionInputs>
          </Section>
          <Section>
            <SectionHeader>Project data</SectionHeader>
            <SectionInputs>
              <SectionInputsPort>
                {fields.map((field, index) => (
                  <InputField key={field.id}>
                    <FormControlPorts>
                      <TextField
                        label="Port"
                        size="small"
                        required
                        error={!!errors.port?.[index]}
                        focused
                        {...register(`port.${index}`, {
                          required: 'Port is required',
                          validate: {
                            isNumber: (value) => !isNaN(+value) || 'Port must be a number',
                            min: (value) => parseInt(value) >= 0 || 'Port cannot be less than 0',
                            max: (value) => parseInt(value) <= 65535 || 'Port cannot be bigger than 65535',
                          },
                        })}
                      />
                      {!!errors.port?.[index] && (
                        <FormHelperText>{errors.port?.[index]?.message}</FormHelperText>
                      )}
                    </FormControlPorts>
                    {fields.length > 1 && <Button size="small" type="button" onClick={() => remove(index)} variant="outlined">
                      X
                    </Button>}

                  </InputField>
                ))}
              </SectionInputsPort>


              <Button type="button" onClick={() => append({ port: "" })} variant="outlined">
                Add Port
              </Button>
              <FormControl>
                <Button
                  component="label"
                  variant="outlined"
                >
                  env file
                  <FileInput
                    id="envFile"
                    type="file"
                    accept=".env"
                    style={{ display: "none" }}
                    {...register('envFile')}
                  />
                </Button>
                {!errors.envFile?.message && envFile &&
                  !!envFile.length && (
                    <FormHelperText>
                      File: {envFile[0].name}
                    </FormHelperText>
                  )}
                {errors.envFile && <FormHelperText>
                  {errors.envFile.message}
                </FormHelperText>
                }
              </FormControl>
            </SectionInputs>
          </Section>
          <ButtonsContainer>
            <Button onClick={comeBack} variant="outlined">
              Back
            </Button>
            <Button variant="outlined" onClick={handleSubmit(onSubmit)} >
              Save
            </Button>



          </ButtonsContainer>
        </ProjectOptionsContainer>
        <SelectProjectsContainer>
        </SelectProjectsContainer>
      </FormContainer>
    </Container >
  );
};


