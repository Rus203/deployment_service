import {
  Button,
  Card,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../Components/Spinner/spinner.component";
import { IProject } from "../../interface/project.interface";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useDeployProjectMutation,
  useGetProjectsLazyQuery,
  useUpdateProjectMutation,
} from "../../services";
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


interface FormInputs {
  name: string;
  email: string;
  sshGitPrivateKey: null | FileList;
  sshGitPublicKey: null | FileList;
  gitLink: string;
  sshServerUrl: string;
  sshFile: null | FileList;
  envFile: null | FileList;
}

export const Deploy: FC<{hasAccess: boolean }> = ({ hasAccess = false }) => {
  const { projectId } = useParams();
  const navigate = useNavigate()

  const [createProject, { status: createProjectStatus }] =
    useCreateProjectMutation();
  const [updateProject, { status: updateProjectStatus }] =
    useUpdateProjectMutation();
  const [deployProject, { status: deployProjectStatus }] =
    useDeployProjectMutation();
  const [getProjects] = useGetProjectsLazyQuery();
  const [deleteProject] = useDeleteProjectMutation()

  const [isLoading, setLoading] = useState<boolean>(false);
  const [project, setProject] = useState<IProject | null>(null);
  const [otherProjects, setOtherProjects] = useState<any[]>([
    {
      id: "string",
      name: "string",
      email: "string",
      sshGitPrivateKeyProject: "string",
      gitProjectLink: "string",
    },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  const watchSshFile = watch("sshFile");
  const watchPrivateKey = watch("sshGitPrivateKey");
  const watchPublicKey = watch("sshGitPublicKey");
  const watchEnvFile = watch("envFile");

  const onSubmit: SubmitHandler<FormInputs> = (data: FormInputs) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("gitLink", data.gitLink);
    formData.append("sshServerUrl", data.sshServerUrl);

    if (
      !project &&
      data.sshFile &&
      data.envFile &&
      data.sshGitPrivateKey &&
      data.sshGitPublicKey
    ) {
      formData.append("sshFile", data.sshFile[0]);
      formData.append("envFile", data.envFile[0]);
      formData.append("sshGitPrivateKey", data.sshGitPrivateKey[0]);
      formData.append("sshGitPublicKey", data.sshGitPublicKey[0]);
    }

    formData.forEach((value, key) => {
      if (!value) {
        formData.delete(key);
      }
    });

    return updateProject({ id: project!.id, body: formData });
  };

  const selectHandler = (event: SelectChangeEvent<string>) => {
    const editProject = otherProjects.find((p) => p.id === event.target.value);
    setProject(editProject || null);
    setProjectInputs(editProject || null);
  };

  const deployHandler = () => {
    if (project !== null) {
      deployProject(project.id);
    }
  };

  const deleteHandle = () => {
    if (project !== null) {
      deleteProject(project.id)
    }
  }

  const handleComeBack = () => {
    navigate('/')
  }

  const setProjectInputs = (project: IProject | null) => {
    reset({
      name: project?.name || "",
      email: project?.email || "",
      // sshServerUrl: project?.sshServerUrl || "",
      gitLink: project?.gitProjectLink || "",
      sshGitPrivateKey: null,
      sshGitPublicKey: null,
      sshFile: null,
      envFile: null,
    });
  };

  useEffect(() => {
    setLoading(true);
    getProjects(undefined, false)
      .then((response) => {
        if (!response.data) return;
        setOtherProjects(response.data);
        if (!projectId) return;
        const editProject = response.data.find(
          (p: IProject) => p.id === projectId
        );
        setProject(editProject || null);
        setProjectInputs(editProject || null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (
      createProjectStatus === QueryStatus.pending ||
      updateProjectStatus === QueryStatus.pending ||
      deployProjectStatus === QueryStatus.pending
    ) {
      setLoading(true);
    }

    if (
      createProjectStatus !== QueryStatus.pending &&
      updateProjectStatus !== QueryStatus.pending &&
      deployProjectStatus !== QueryStatus.pending
    ) {
      setLoading(false);
    }
  }, [createProjectStatus, updateProjectStatus, deployProjectStatus]);

  return !hasAccess ? <Navigate to="/login" replace={true} /> : (
    <Container>
      {isLoading ? (
        <Spinner typeOfMessages={null} />
      ) : (
        <FormContainer>
          <ProjectOptionsContainer>
            <Section>
              <SectionHeader>Your data</SectionHeader>
              <SectionInputs>
                <FormControl>
                  <TextField
                    label="Name"
                    error={!!errors.name?.message}
                    focused
                    required
                    size="small"
                    {...register("name", {
                      required: "*Name is required",
                    })}
                  />
                  {errors.name && (
                    <FormHelperText>{errors.name?.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <TextField
                    label="Email"
                    size="small"
                    type="email"
                    required
                    focused
                    error={!!errors.email?.message}
                    {...register("email", {
                      required: "*Email Address is required",
                      validate: (v: string) => {
                        return !!v.match(
                          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        )
                          ? true
                          : "Must be a valid email";
                      },
                    })}
                  />
                  {errors.email && (
                    <FormHelperText>{errors.email?.message}</FormHelperText>
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
                    focused
                    defaultValue={project?.gitProjectLink || ""}
                    error={!!errors.gitLink?.message}
                    {...register("gitLink", {
                      required: "*Git link is required",
                    })}
                  />
                  {errors.gitLink && (
                    <FormHelperText>{errors.gitLink?.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <Button
                    component="label"
                    variant="outlined"
                    color={!!errors.sshGitPublicKey ? "error" : undefined}
                  >
                    SSH Git public key
                    <FileInput
                      id="ssh-git-public-file"
                      accept=".pub"
                      type="file"
                      style={{ display: "none" }}
                      {...register("sshGitPublicKey", {
                        required: project
                          ? false
                          : "*SSH git public key is required",
                      })}
                    />
                  </Button>
                  {errors.sshGitPublicKey && (
                    <FormHelperText>
                      {errors.sshGitPublicKey?.message}
                    </FormHelperText>
                  )}
                  {!errors.sshGitPublicKey?.message &&
                    watchPublicKey &&
                    !!watchPublicKey.length && (
                      <FormHelperText>
                        File: {watchPublicKey[0].name}
                      </FormHelperText>
                    )}
                </FormControl>
                <FormControl>
                  <Button
                    component="label"
                    variant="outlined"
                    color={!!errors.sshGitPrivateKey ? "error" : undefined}
                  >
                    SSH Git private key
                    <FileInput
                      id="ssh-git-private-file"
                      type="file"
                      style={{ display: "none" }}
                      {...register("sshGitPrivateKey", {
                        required: project
                          ? false
                          : "*SSH git private key is required",
                      })}
                    />
                  </Button>
                  {errors.sshGitPrivateKey && (
                    <FormHelperText>
                      {errors.sshGitPrivateKey?.message}
                    </FormHelperText>
                  )}
                  {!errors.sshGitPrivateKey?.message &&
                    watchPrivateKey &&
                    !!watchPrivateKey.length && (
                      <FormHelperText>
                        File: {watchPrivateKey[0].name}
                      </FormHelperText>
                    )}
                </FormControl>
              </SectionInputs>
            </Section>
            <Section>
              <SectionHeader>SSH data</SectionHeader>
              <SectionInputs>
                <FormControl>
                  {/* <TextField
                    label="SSH Server url"
                    size="small"
                    defaultValue={project?.sshServerUrl || ""}
                    required
                    focused
                    error={!!errors.sshServerUrl?.message}
                    {...register("sshServerUrl", {
                      required: "*SSH Server url required",
                    })}
                  /> */}
                  {errors.sshServerUrl && (
                    <FormHelperText>
                      {errors.sshServerUrl?.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <Button
                    component="label"
                    variant="outlined"
                    color={!!errors.sshFile ? "error" : undefined}
                  >
                    SSH File
                    <FileInput
                      id="ssh-file"
                      type="file"
                      style={{ display: "none" }}
                      {...register("sshFile", {
                        required: project
                          ? false
                          : "*You must provide ssh file",
                        validate: (v: FileList | null) => {
                          return !!project || (v && v[0].name) === "id_rsa"
                            ? true
                            : "Invalid file";
                        },
                      })}
                    />
                  </Button>
                  {errors.sshFile && (
                    <FormHelperText>{errors.sshFile?.message}</FormHelperText>
                  )}
                  {!errors.sshFile?.message &&
                    watchSshFile &&
                    !!watchSshFile.length && (
                      <FormHelperText>
                        File: {watchSshFile[0].name}
                      </FormHelperText>
                    )}
                </FormControl>
                <FormControl>
                  <Button
                    component="label"
                    variant="outlined"
                    color={!!errors.envFile ? "error" : undefined}
                  >
                    Env File
                    <FileInput
                      id="env-file"
                      type="file"
                      accept=".env"
                      style={{ display: "none" }}
                      {...register("envFile", {
                        required: project ? false : "*Env file is required",
                      })}
                    />
                  </Button>
                  {errors.envFile && (
                    <FormHelperText>{errors.envFile?.message}</FormHelperText>
                  )}
                  {!errors.envFile?.message &&
                    watchEnvFile &&
                    !!watchEnvFile.length && (
                      <FormHelperText>
                        File: {watchEnvFile[0].name}
                      </FormHelperText>
                    )}
                </FormControl>
              </SectionInputs>
            </Section>
            <ButtonsContainer>
            <Button variant="outlined" onClick={handleComeBack}>
                Back
              </Button>
              <Button variant="outlined" onClick={handleSubmit(onSubmit)}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => deployHandler()}>
                Deploy
              </Button>
              <Button variant="outlined" onClick={() => deleteHandle()}>
                Delete
              </Button>
            </ButtonsContainer>
          </ProjectOptionsContainer>
          <SelectProjectsContainer>
          </SelectProjectsContainer>
        </FormContainer>
      )}
    </Container>
  );
};
