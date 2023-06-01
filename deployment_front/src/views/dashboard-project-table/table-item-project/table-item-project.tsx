import { Box, Button, TableCell, TableRow, Typography } from '@mui/material';
import { FC, useState } from 'react';
import Spinner from '../../../Components/Spinner';
import { IProject } from '../../../interface/project.interface';
import { ProjectState } from '../../../utils/project-state.enum';
import { IMiniBack } from '../../../interface/miniback.interface';

type Props = {
  row: any,
  index: number,
  miniback?: IMiniBack,
  isFetching: boolean

}

const TableItemProject: FC<Props> = ({ index, row, miniback, isFetching }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const handleDeploy = (project: IProject) => {
    setIsLoading(true)
  }

  const handleDelete = (project: IProject) => {  }


  return (
    <TableRow
      hover
      key={index}
      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
    >
      <TableCell>{index + 1}</TableCell>
      <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.name}</Typography>
          <Typography variant='caption'>{row.email}</Typography>
        </Box>
      </TableCell>
      <TableCell>{row.gitLink}</TableCell>
      <TableCell>{row.port}</TableCell>
      <TableCell>{row.state}</TableCell>
      <TableCell colSpan={4} sx={{ display: 'flex', justifyContent: 'space-around', columnGap: '15px' }} >
        {isFetching || isLoading ?
          <Spinner typeOfMessages={null} />
          :
          <>
            <Button
              variant='outlined'
              disabled={row.state !== ProjectState.UNDEPLOYED
                || row.state === ProjectState.FAILED
              }
              onClick={() => handleDeploy(row)}
            >Deploy</Button>
            <Button
              onClick={() => handleDelete(row)}
              variant='outlined'
              color='error'
            >
              Delete</Button>
          </>
        }
      </TableCell>
      {/* {(errorMessage !== null && isShowAlert)
        ?
        <TableCell><Alert error={errorMessage} /></TableCell>
        : null
      } */}
    </TableRow>

  );
};

export default TableItemProject;