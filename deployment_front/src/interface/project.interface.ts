import { ProjectState } from '../utils/project-state.enum'

export interface IProject {
  id: string,
  email: string,
  name: string,
  state: ProjectState,
  gitLink: string
}
