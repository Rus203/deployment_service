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
} from "./deploy.styles";
import { Navigate } from 'react-router-dom';

export const Deploy: FC<{hasAccess: boolean }> = ({ hasAccess = false }) => {
  return !hasAccess ? <Navigate to="/login" replace={true} /> : (
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
                    required
                    size="small"
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Email"
                    size="small"
                    type="email"
                    required
                    focused
                  />
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
                    focused
                  />
                </FormControl>
                <FormControl>
                  <Button
                    component="label"
                    variant="outlined"
                  >
                    SSH Git private key
                    <FileInput
                      id="ssh-git-private-file"
                      type="file"
                      style={{ display: "none" }}
                    />
                  </Button>
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
                    focused
                  />
                </FormControl>
                <FormControl>
                  <Button
                    component="label"
                    variant="outlined"
                  >
                    env file
                    <FileInput
                      id="ssh-git-private-file"
                      type="file"
                      style={{ display: "none" }}
                    />
                  </Button>
                </FormControl>
              </SectionInputs>
            </Section>
            <ButtonsContainer>
            <Button variant="outlined">
                Back
              </Button>
              <Button variant="outlined">
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
