export interface IProject {
  id: string;
  name: string;
  email: string;
  sshServerUrl: string;
  sshGitPrivateKey: string;
  sshGitPublicKey: string;
  gitLink: string;
  envFile: string;
  sshFile: string;
  uploadPath: string;
  projectUrl: string;
  minibackUrl: string;
}
