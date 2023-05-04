import { ProjectState } from '../utils/project-state.enum'

export interface IMiniBackAnswer {
  id: string;
  name: string;
  serverUrl: string;
  nameRemoteRepository: string;
  userId: string;
  deployState: ProjectState;
}

export interface IMiniBackRequest {
  name: string;
  sshConnectionString: string;
  sshServerPrivateKey: File;
}