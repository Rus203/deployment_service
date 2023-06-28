import React from 'react'
import TableItem from './table-item.component'
import { IMiniBack } from '../../../interface/miniback.interface'

type Props = {
  row: IMiniBack,
  index: number,
  followToProjects: (miniBackId: string) => void
}

const Component: React.FC<Props> = ({ row, index, followToProjects }) => {
  return <TableItem row={row} index={index} followToProjects={followToProjects} />
}

export default Component