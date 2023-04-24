export interface IMiniback {
  id: string;
  name: string;
  sshServerPrivateKeyPath: string;
  serverUrl: string;
  nameRemoteRepository: string;
  userId: string;
  isDeploy: boolean;
}