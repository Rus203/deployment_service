import { Button, TableCell, TableRow } from '@mui/material';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { IMiniBack } from '../../../interface/miniback.interface';
import { MiniBackState } from '../../../utils/mini-back-state.enum';
import io, { Socket } from 'socket.io-client'
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import Alert from '../../../Components/Alert';
import {
  deleteMiniBackItem,
  rejectMiniBackLoading,
  setMiniBackLoading,
  setMiniBackStatus,
  successMiniBackLoading,
} from '../../../store/Slices/mini-back.slice';
import { deleteMiniBackProjects } from '../../../store/Slices/project.slice'
import CircularStatic from '../../../Components/CircularProgressWithLabel/circular-progress-with-label.component';

type Props = {
  row: IMiniBack,
  index: number,
  followToProjects: (miniBackId: string) => void
}

const TableItem: FC<Props> = ({ row, index, followToProjects }) => {
  const [loadingAmount, setLoadingAmount] = useState<number>(0)
  const [socket, setSocket] = useState<Socket>()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false)
  const account = useAppSelector(state => state.auth.account)
  const loading = useAppSelector(state => state.miniBack.miniBackCollection).find(el => el.id === row.id)?.isLoading
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      const url = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_SOCKET_BACK_DEPLOYMENT_URL!
        : process.env.REACT_APP_SOCKET_BACK_DEV_URL!

      const socketInstance = io(url + `?token=${account.accessToken}`)
      setSocket(socketInstance)

      socketInstance?.on(`error-${row.id}`, data => {
        console.log('errors ', data)
        setIsShowAlert(true)
        setErrorMessage(data)
        dispatch(setMiniBackStatus({ id: row.id, status: MiniBackState.FAILED }))
        dispatch(rejectMiniBackLoading({ id: row.id }))
      })

      socketInstance?.on(`progress-deploy-mini-back-${row.id}`, data => {
        console.log(data)
        setLoadingAmount(data)
      })

      socketInstance?.on(`progress-delete-mini-back-${row.id}`, data => {
        console.log(data)
        dispatch(setMiniBackLoading({ id: row.id }))
        setLoadingAmount(data)
      })

      socketInstance?.on(`finish-delete-mini-back-${row.id}`, data => {
        console.log("finish-delete")
        dispatch(successMiniBackLoading({ id: row.id }))
        dispatch(deleteMiniBackItem({ id: row.id }))
        dispatch(deleteMiniBackProjects({ id: row.id }))
      })

      socketInstance?.on(`finish-deploy-mini-back-${row.id}`, data => {
        console.log('finish-deploy')
        dispatch(successMiniBackLoading({ id: row.id }))
        dispatch(setMiniBackStatus({ id: row.id, status: MiniBackState.DEPLOYED }))
      })

      return () => { socketInstance.disconnect() }
    }
  }, [])

  useEffect(() => {
    if (isShowAlert) {
      const timerId = setTimeout(() => setIsShowAlert(false), 10000);
      return () => clearTimeout(timerId);
    }
  }, [isShowAlert])



  const handleDelete = (event: SyntheticEvent) => {
    event.stopPropagation()
    console.log('delete-miniback')
    socket?.emit('delete-miniback', { id: row.id })
  }

  const handleDeploy = (event: SyntheticEvent) => {
    event.stopPropagation()
    dispatch(setMiniBackLoading({ id: row.id }))
    socket?.emit(`deploy-miniback`, { id: row.id })
  }

  useEffect(() => {
    if (isShowAlert) {
      const timerId = setTimeout(() => setIsShowAlert(false), 3000);
      return () => clearTimeout(timerId);
    }
  }, [isShowAlert])


  return (

    <TableRow
      hover
      onClick={() => followToProjects(row.id)}
      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 }, "cursor": "pointer" }}
    >
      <TableCell>{index}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.serverUrl}</TableCell>
      <TableCell>{row.port}</TableCell>
      <TableCell>{row.deployState}</TableCell>

      <TableCell colSpan={4} sx={{ display: 'flex', justifyContent: 'space-around', columnGap: '15px' }} >
        {loading ?
          <CircularStatic value={loadingAmount * 100} />
          :
          <>
            <Button
              variant='outlined'
              onClick={(event) => handleDeploy(event)}
              disabled={row.deployState === MiniBackState.DEPLOYED
                || row.deployState === MiniBackState.FAILED}
            >
              Deploy
            </Button>
            <Button
              onClick={(e: any) => handleDelete(e)}
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