import React from 'react'

import TableItemProject from './table-item-project'
import { IProject } from '../../../interface/project.interface'

type Props = {
  index: number,
  project: IProject,
  serverUrl: string,
  port: number,
}

const Component: React.FC<Props> = ({ index, project, serverUrl, port }) => {
  return <TableItemProject
    index={index}
    key={index}
    project={project}
    serverUrl={serverUrl}
    port={port}
    />
}

export default Component