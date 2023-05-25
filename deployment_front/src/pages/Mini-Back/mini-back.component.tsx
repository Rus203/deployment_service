import {
  Button,
  TextField
} from "@mui/material";
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Spinner';
import { IMiniBack } from '../../interface/miniback.interface';
import { useCreateMinibackMutation, useGetMinibacksQuery } from '../../services';
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

interface IMiniBackInputs {
  name: string,
  sshConnectionString: string,
  sshServerPrivateKey: FileList,
}

export const MiniBack: FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IMiniBackInputs>({
    mode: 'onChange'
  });

  const { data } = useGetMinibacksQuery(undefined)
  const [createMiniBack, { isLoading }] = useCreateMinibackMutation()
  const navigate = useNavigate();

  const sshServerPrivateKey = watch('sshServerPrivateKey');

  const onSubmit = async (data: IMiniBackInputs) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('sshConnectionString', data.sshConnectionString)
    formData.append('sshServerPrivateKey', data.sshServerPrivateKey[0])

    createMiniBack(formData).then(() => navigate('/'))
  }

  const comeBack = () => {
    navigate('/');
  }

  return isLoading ? <Spinner typeOfMessages={null} /> : (
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
                    validate: (value: string) => {
                      const testUrl = value.split('@')[1]
                      if (data !== undefined) {
                        let result = data.find((item: IMiniBack) => {
                          const url = item.serverUrl
                          return testUrl === url
                        })

                        return result ? "This server has already busy" : true
                      }

                      return true
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
