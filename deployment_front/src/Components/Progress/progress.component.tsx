import { Box, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  MessageEvent,
  ProjectCreateMessage,
  ProjectDeployMessage,
  useServerMessages,
} from "../../hooks";

interface IProps {
  eventType: MessageEvent;
}

interface IProgressObject {
  message: string;
  value: number;
}

export const Progress = ({ eventType }: IProps) => {
  const [progress, setProgress] = useState<IProgressObject>({
    message: "",
    value: 0,
  });

  const createProjectSteps: Record<ProjectCreateMessage, IProgressObject> = {
    [ProjectCreateMessage.Start]: {
      message: "Creating of the project is starting",
      value: 10,
    },
    [ProjectCreateMessage.Creating]: {
      message: "Initializing project, instantiating of all needed addresses",
      value: 40,
    },
    [ProjectCreateMessage.Cloning]: {
      message: "Attempt to clone project repo using provided credentials",
      value: 70,
    },
    [ProjectCreateMessage.FilesEncryption]: {
      message: "Encrypting all unencrypted credentials in files",
      value: 90,
    },
    [ProjectCreateMessage.Finish]: {
      message: "Finish creating of project",
      value: 100,
    },
  };

  const deployProjectSteps: Record<ProjectDeployMessage, IProgressObject> = {
    [ProjectDeployMessage.Start]: {
      message: "Deployment of the project is starting",
      value: 10,
    },
    [ProjectDeployMessage.FindProject]: {
      message: "Looking for existing project",
      value: 20,
    },
    [ProjectDeployMessage.DecryptFiles]: {
      message: "Decrypting encrypted credentials",
      value: 30,
    },
    [ProjectDeployMessage.PushingToRemoteServer]: {
      message: "Pushing data to remote server",
      value: 60,
    },
    [ProjectDeployMessage.RunningMiniBack]: {
      message: "Running project handler scrypt",
      value: 80,
    },
    [ProjectDeployMessage.EncryptingFiles]: {
      message: "Encrypting all unencrypted credentials in files",
      value: 90,
    },
    [ProjectDeployMessage.Finish]: {
      message: "Finish deploying of project",
      value: 100,
    },
  };

  const currentMessage = useServerMessages(eventType);

  useEffect(() => {
    if (!currentMessage) return;

    if (currentMessage && eventType === MessageEvent.ProjectCreate) {
      setProgress(createProjectSteps[currentMessage as ProjectCreateMessage]);
    }

    if (currentMessage && eventType === MessageEvent.ProjectDeploy) {
      setProgress(deployProjectSteps[currentMessage as ProjectDeployMessage]);
    }
  }, [eventType, currentMessage]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" value={progress.value} />
        </Box>
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
          >{`${progress.value}%`}</Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant="h6" color="text.primary">
          {progress.message}
        </Typography>
      </Box>
    </>
  );
};
