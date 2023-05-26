import { Button, TableCell, TableRow } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import Spinner from '../../../Components/Spinner';
import { IMiniBack } from '../../../interface/miniback.interface';
import { useDeleteMinibackMutation, useDeployMinibackMutation } from '../../../services';
import { MiniBackState } from '../../../utils/mini-back-state.enum';
import Alert from '../../../Components/Alert';

type Props = {
  row: IMiniBack,
  index: number,
  followToProjects: (miniBackId: string) => void
}

const TableItem: FC<Props> = ({ row, index, followToProjects }) => {
  const [deleteMiniBack, { isLoading: isLoadingDelete }] = useDeleteMinibackMutation()
  const [deployMiniBack, { isLoading: isLoadingDeploy }] = useDeployMinibackMutation()
  const [isShowAlert, setShowAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleDelete: any = async (event: any, minibackId: any) => {
    event.stopPropagation();
    try {
      await deleteMiniBack(minibackId).unwrap()
    } catch (e: any) {
      setShowAlert(true)
      console.log(e.data.message)
      setErrorMessage(e.data.message)
    } 
  }

  const handleDeployMiniback = async (id: string) => {
    try {
      await deployMiniBack(id).unwrap()

    } catch (e: any) {
      setShowAlert(true)
      console.log(e.data.message)
      setErrorMessage(e.data.message)
    } 
  }

  const handleFollowToProjects = (id: string) => {
    if (isLoadingDelete || isLoadingDeploy) {
      return
    }
    return followToProjects(id)
  }

  useEffect(() => {
    if (isShowAlert) {
      const timerId = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timerId);
    }
  }, [isShowAlert])

  return (

    <TableRow
      hover
      onClick={() => handleFollowToProjects(row.id)}
      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 }, "cursor": "pointer" }}
    >
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.serverUrl}</TableCell>
      <TableCell>{row.port}</TableCell>
      <TableCell>{row.deployState}</TableCell>


      <TableCell colSpan={4} sx={{ display: 'flex', justifyContent: 'space-around', columnGap: '15px' }} >
        {isLoadingDelete || isLoadingDeploy ?
          <span><Spinner typeOfMessages={null} /></span>
          :
          <>
            <Button
              variant='outlined'
              onClick={() => handleDeployMiniback(row.id)}
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
      {(errorMessage !== null && isShowAlert)
        ?
        <TableCell><Alert error={errorMessage} /></TableCell>
        : null
      }
    </TableRow>

  );
}


export default TableItem;