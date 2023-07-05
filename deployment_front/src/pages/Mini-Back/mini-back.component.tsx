import {
  Button,
  TextField
} from "@mui/material";
import { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Spinner';
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
  SelectProjectsContainer
} from "./mini-back.styles";
import axios from '../../utils/axios.instance'
import { IMiniBack } from "../../interface/miniback.interface";

interface IMiniBackInputs {
  name: string,
  sshConnectionString: string,
  sshServerPrivateKey: FileList,
  envFile: FileList
}

export const MiniBack: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notAvailableUrls, setNotAvailableUrls] = useState<string[]>([])
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IMiniBackInputs>({
    mode: 'onChange'
  });

  const navigate = useNavigate();

  const sshServerPrivateKey = watch('sshServerPrivateKey');
  const envFile = watch('envFile');

  useEffect(() => {
    axios.get('mini-back').then(res => {
      const urls = res.data.map((item: IMiniBack) => item.serverUrl)
      setNotAvailableUrls(urls)
    })
  }, [])

  const onSubmit = async (data: IMiniBackInputs) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('sshConnectionString', data.sshConnectionString)
    formData.append('sshServerPrivateKey', data.sshServerPrivateKey[0])
    formData.append('envFile', data.envFile[0])

    setLoading(true)
    axios.post('mini-back', formData)
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

  const comeBack = () => {
    navigate('/');
  }

  return loading ? <Spinner /> : (
    <Container>
      <FormContainer>
        <ProjectOptionsContainer>
          <Section>
            <SectionHeader>Server data</SectionHeader>
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
                  label="SSH connection string"
                  size="small"
                  type="text"
                  error={!!errors.sshConnectionString}
                  required
                  focused
                  {...register("sshConnectionString", {
                    required: 'SSH connection string is required',
                    maxLength: 63,
                    pattern: {
                      value: /^[a-zA-Z]+@[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/,
                      message: "Please Enter a valid ssh connection string"
                    },
                    validate: (value) => {
                      let url = value.split('@')[1];
                      return notAvailableUrls.every(item => item !== url) || 'This sever is\'t available'
                    }
                  })}
                />
                {errors.sshConnectionString && (
                  <FormHelperText>{errors.sshConnectionString.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl>
                <Button
                  component="label"
                  variant="outlined"
                >
                  SSH server private key
                  <FileInput
                    id="sshServerPrivateKey"
                    type="file"
                    style={{ display: "none" }}
                    {...register('sshServerPrivateKey', {
                      required: 'SSH server private key is required'
                    })}
                  />
                </Button>
                {!errors.sshServerPrivateKey?.message && sshServerPrivateKey &&
                  !!sshServerPrivateKey.length && (
                    <FormHelperText>
                      File: {sshServerPrivateKey[0].name}
                    </FormHelperText>
                  )}
                {errors.sshServerPrivateKey && <FormHelperText>
                  {errors.sshServerPrivateKey.message}
                </FormHelperText>
                }
              </FormControl>
            </SectionInputs>
            <SectionHeader>Mini-back data</SectionHeader>
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
                    style={{ display: "none" }}
                    {...register('envFile', {
                      required: 'env file is required'
                    })}
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
            <Button variant="outlined" onClick={comeBack}>
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
