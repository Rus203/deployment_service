import React from 'react'

import { IMiniBack } from '../../../interface/miniback.interface'
import TableItemProject from './table-item-project'

type Props = {
  row: any,
  index: number,
  miniback?: IMiniBack,
  isFetching: boolean
}

const Component: React.FC<Props> = ({ row, index, miniback, isFetching }) => {
  return <TableItemProject row={row} index={index} isFetching={isFetching} key={index} miniback={miniback} />
}

export default Component