import { MiniBackState } from "../utils/mini-back-state.enum";

export interface IMiniBack {
  id: string;
  name: string;
  serverUrl: string;
  nameRemoteRepository: string;
  userId: string;
  deployState: MiniBackState;
  port: number;
}