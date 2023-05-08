import { ProjectState } from '../utils/project-state.enum'

export interface IProject {
  id: string,
  name: string,
  gitLink: string,
  email: string,
  port: number,
  state: ProjectState
}
