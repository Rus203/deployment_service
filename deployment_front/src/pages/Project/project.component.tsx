import { FC } from 'react'
import {
  Button,
  TextField,
} from "@mui/material";
import {
  Container,
  FormContainer,
  ProjectOptionsContainer,
  SelectProjectsContainer,
  FormControl,
  SectionHeader,
  Section,
  SectionInputs,
  ButtonsContainer,
  FormHelperText,
  FileInput,
} from "./project.styles";
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { useCreateProjectMutation, useGetMinibackQuery, useGetProjectsQuery } from '../../services';

interface IProject {
  name: string,
  email: string,
  port: number,
  gitLink: string,
  envFile: FileList,
  sshGitPrivateKey: FileList
} 

export const Project: FC = () => {
  const { register, handleSubmit, watch, formState: {errors} } = useForm<IProject>({
    mode: 'onChange'
  });

  const navigate = useNavigate()
  const location = useLocation()
  const miniBackId = location.pathname.split('/')[2]
  const { data: miniback } = useGetMinibackQuery(miniBackId)
  const [addProject] = useCreateProjectMutation()
  const { data: projects } = useGetProjectsQuery({serverUrl: miniback?.serverUrl, port: miniback?.port})

  const envFile = watch('envFile');
  const sshGitPrivateKey = watch('sshGitPrivateKey')

  const onSubmit = async (data: IProject) => {
    // here we will send data to the backend
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('port', data.port.toString())
    formData.append('gitLink', data.gitLink)
    formData.append('envFile', data.envFile[0])
    formData.append('sshGitPrivateKey', data.sshGitPrivateKey[0])
    addProject({ serverUrl: miniback?.serverUrl, port: miniback?.port, body: formData})
  }

  const comeBack = (): void => {
    navigate(`/mini-back/${miniBackId}`)
  }

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
                    { ...register("name", {
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
                    required
                    focused
                    { ...register("email", {
                      required: 'Email is required',
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
                    { ...register('gitLink', {
                      required: 'Git link is required',
                      maxLength: 2047
                    })}
                  />
                  { errors.gitLink && <FormHelperText>
                    { errors.gitLink.message}
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
                      { ...register('sshGitPrivateKey', {
                        required: 'SSH git private key is required',
                      })}
                    />
                  </Button>
                  { errors.sshGitPrivateKey && <FormHelperText>
                      {errors.sshGitPrivateKey.message}
                    </FormHelperText>
                  }
                  { errors.sshGitPrivateKey && <FormHelperText>
                    {!errors.sshGitPrivateKey?.message && sshGitPrivateKey &&
                      !!sshGitPrivateKey.length && (
                        <FormHelperText>
                          File: {sshGitPrivateKey[0].name}
                        </FormHelperText>
                      )}
                      {errors.sshGitPrivateKey.message}
                      </FormHelperText>}
                </FormControl>
              </SectionInputs>
            </Section>
            <Section>
              <SectionHeader>Project data</SectionHeader>
              <SectionInputs>
                <FormControl>
                  <TextField
                    label="port"
                    size="small"
                    required
                    error={!!errors.port}
                    focused
                    { ...register('port', {
                      required: 'Port is required',
                      validate: {
                        isNumber: (value) => !isNaN(value) || 'Port must be a number',
                        min: (value: any) => parseInt(value) >= 0 || 'Port can not be less than 0',
                        max: (value: any) => parseInt(value) <= 65535 || 'Port can not be bigger than 65535',
                        isUnique: (value: number) => {
                          if (projects !== undefined) {
                            const result = projects.find(item => value === item.port)
                            return result !== undefined ? "This port has already busy" : true
                          }

                          return true
                        }
                      },
                    })}
                  />
                  { errors.port && <FormHelperText>
                    {errors.port.message}
                    </FormHelperText>}
                </FormControl>
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
                      { ...register('envFile', {
                        required: 'Env file is required'
                      })}
                    />
                  </Button>
                  {!errors.envFile?.message && envFile &&
                      !!envFile.length && (
                        <FormHelperText>
                          File: {envFile[0].name}
                        </FormHelperText>
                  )}
                  { errors.envFile && <FormHelperText>
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
    </Container>
  );
};
