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
} from "./mini-back.styles";
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

interface IMiniBack {
  name: string,
  sshConnectionString: string,
  sshServerPrivateKey: FileList,
} 

export const MiniBack: FC = () => {
  const { register, handleSubmit, watch, formState: {errors} } = useForm<IMiniBack>({
    mode: 'onChange'
  });

  const navigate = useNavigate();

  const sshServerPrivateKey = watch('sshServerPrivateKey');

  const onSubmit = async (data: object) => {
    // here we will send data to the backend
    console.log(data);
  }

  const comeBack = () => {
    navigate('/');
  }

  return (
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
                    label="SSH connection string"
                    size="small"
                    type="text"
                    error={!!errors.sshConnectionString}
                    required
                    focused
                    { ...register("sshConnectionString", {
                      required: 'SSH connection string is required',
                      maxLength: 63,
                      pattern: {
                        value: /^[a-zA-Z]+@[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/,
                        message: "Please Enter a valid ssh connection string"
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
                      { ...register('sshServerPrivateKey', {
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
                  { errors.sshServerPrivateKey && <FormHelperText>
                      {errors.sshServerPrivateKey.message}
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
