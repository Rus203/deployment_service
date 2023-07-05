import React, { useState } from 'react'
import {
  Container,
  Wrapper,
  ButtonsContainer,
  Section,
  SectionHeader,
  ControlBlock,
  FormHelperText,
} from './health-check.styles'
import { Button, TextField, Alert } from "@mui/material";
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../store/hooks';
import { dropInfo } from '../../store/Slices';
import axios from 'axios';

enum Status {
  SUCCESS = 'success',
  ERROR = 'error',
  UNKNOWN = 'unknown'
}

interface IFields {
  path: string
}

type IProp = {
  host: string
}

const HealthCheck: React.FC<IProp> = ({ host }) => {
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState<Status>(Status.UNKNOWN);

  const { register, handleSubmit, formState: { errors } } = useForm<IFields>();

  const onSubmit = (data: IFields) => {
    const url = `http://${host}:${data.path}`;
  
    axios.get(url)
      .then((response) => {
        setStatus(Status.SUCCESS);
      })
      .catch((error) => {
        setStatus(Status.ERROR);
      });
  };
  

  return  (
    <Container>
      <Wrapper>
        <Section>
            <SectionHeader>Type you path</SectionHeader>
            <TextField
              label="port / path"
              variant="standard"
              type='text'
              defaultValue=''
              required
              placeholder='3000/'
              error={!!errors.path}
              title='specify app port and path'
              { ...register('path', {
                required: 'Port and path are required',
                maxLength: 2000
              })}
            />
              {errors.path && ( <FormHelperText>{errors.path.message}</FormHelperText> )}
            <ControlBlock>
                <ButtonsContainer>
                  <Button
                    variant="contained"
                    onClick={() => { dispatch(dropInfo()) }}
                  >
                    Cancel
                  </Button>
                  <Button
                      variant="contained"
                      type='submit'
                      onClick={handleSubmit(onSubmit)}
                    >
                      Test path
                  </Button>
                </ButtonsContainer>
                {
                  status === Status.SUCCESS
                    ? <Alert severity="success">Success</Alert>
                    : status === Status.ERROR
                    ? <Alert severity="error">Can't reach this path</Alert>
                    : <></>
                }
            </ControlBlock>
        </Section>
      </Wrapper>
    </Container>
  )
}

export default HealthCheck
