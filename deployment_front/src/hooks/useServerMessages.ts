import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export enum MessageEvent {
  ProjectCreate = "projectCreate",
  ProjectDeploy = "projectDeploy",
}

export enum ProjectCreateMessage {
  Start = "start",
  Creating = "creating",
  Cloning = "cloning",
  FilesEncryption = "filesEncryption",
  Finish = "finish",
}

export enum ProjectDeployMessage {
  Start = "start",
  FindProject = "findProject",
  DecryptFiles = "decryptFiles",
  PushingToRemoteServer = "pushingToRemoteServer",
  RunningMiniBack = "runningMiniBack",
  EncryptingFiles = "encryptingFiles",
  Finish = "finish",
}

export type Message = ProjectCreateMessage | ProjectDeployMessage;

export const useServerMessages = (typeOfEvent: MessageEvent | null) => {
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!typeOfEvent) return;

    const socket = io(process.env.REACT_APP_BACK_WEBSOCKET_DEV_URL!, {
      transports: ["websocket"],
    });

    socket.on(typeOfEvent, ({ message }: { message: Message }) => {
      setCurrentMessage(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return currentMessage;
};
