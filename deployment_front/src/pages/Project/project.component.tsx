import {
  Button,
  TextField,
} from "@mui/material";
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from "../../store/hooks";
import {
  ButtonsContainer,
  Container,
  FileInput,
  FormContainer,
  FormControl,
  FormHelperText,
  ProjectOptionsContainer,
  Section,
  SectionHeader,
  SectionInputs,
  SelectProjectsContainer,
} from "./project.styles";
import axios from 'axios'
import Spinner from "../../Components/Spinner";

interface IProject {
  name: string,
  email: string,
  gitLink: string,
  envFile: FileList,
  sshGitPrivateKey: FileList
}

export const Project: FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IProject>({
    mode: 'onChange'
  });

  const [loading, setLoading] = useState<boolean>(false);
  const email: string | undefined = useAppSelector(state => state.auth.account?.email)
  const navigate = useNavigate()
  const location = useLocation()
  const miniBackId = location.pathname.split('/')[2]
  const miniBack = useAppSelector(state => state.miniBack.miniBackCollection)
    .find(item => item.id === miniBackId)
  

  const envFile = watch('envFile');
  const sshGitPrivateKey = watch('sshGitPrivateKey')

  const onSubmit = async (data: IProject) => {
    if (miniBack) {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('gitLink', data.gitLink)
      formData.append('envFile', data.envFile[0])
      formData.append('sshGitPrivateKey', data.sshGitPrivateKey[0])

      const { serverUrl, port } = miniBack;
      const url = `http://${serverUrl}:${port}/project`

      setLoading(true)
      axios.post(url)
        .then(() => {
          navigate('/')
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }

  }

  const comeBack = (): void => {
    navigate(`/mini-back/${miniBackId}`)
  }

  return loading ? <Spinner typeOfMessages={null} /> : (
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
                  disabled
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
    </Container>
  );
};
