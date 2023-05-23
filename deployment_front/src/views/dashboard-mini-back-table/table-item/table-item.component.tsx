import { Button, TableCell, TableRow } from '@mui/material';
import { FC } from 'react';
import Spinner from '../../../Components/Spinner';
import { IMiniBack } from '../../../interface/miniback.interface';
import { useDeleteMinibackMutation, useDeployMinibackMutation } from '../../../services';
import { MiniBackState } from '../../../utils/mini-back-state.enum';

type Props = {
  row: IMiniBack,
  index: number,
  followToProjects: (miniBackId: string) => void
}

const TableItem: FC<Props> = ({ row, index, followToProjects }) => {
  const [deleteMiniBack, { isLoading: isLoadingDelete }] = useDeleteMinibackMutation()
  const [deployMiniBack, { isLoading: isLoadingDeploy }] = useDeployMinibackMutation()


  const handleDelete: any = (event: any, minibackId: any) => {
    event.stopPropagation();
    deleteMiniBack(minibackId)
      .catch(e => console.log(e))
  }

  return (
    <TableRow
      hover
      onClick={() => followToProjects(row.id)}
      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 }, "cursor": "pointer" }}
    >
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.serverUrl}</TableCell>
      <TableCell>{row.port}</TableCell>
      <TableCell>{row.deployState}</TableCell>


      <TableCell colSpan={4} sx={{ display: 'flex', justifyContent: 'space-around', columnGap: '15px' }} >
        {isLoadingDelete || isLoadingDeploy ?
          <Spinner typeOfMessages={null} />
          :
          <>
            <Button
              variant='outlined'
              onClick={() => deployMiniBack(row.id)}
              disabled={row.deployState === MiniBackState.DEPLOYED
                || row.deployState === MiniBackState.FAILED}
            >
              Deploy
            </Button>
            <Button
              onClick={(e: any) => handleDelete(e, row.id)}
              variant='outlined'
              color='error'
            >
              Delete
            </Button>
          </>
        }
      </TableCell>

    </TableRow>
  );
}


export default TableItem;