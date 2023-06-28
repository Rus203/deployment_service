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
  setLoadingMiniBack,
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
  const [socket, setSocket] = useState<Socket>()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false)
  const account = useAppSelector(state => state.auth.account)
  const loading = useAppSelector(state => state.miniBack.miniBackCollection).find(el => el.id === row.id)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      const url = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_SOCKET_BACK_DEPLOYMENT_URL!
        : process.env.REACT_APP_SOCKET_BACK_DEV_URL!

      const socketInstance = io(url + `?token=${account.accessToken}`)
      setSocket(socketInstance)

      socketInstance?.on(`error-${row.id}`, data => {
        setIsShowAlert(true)
        setErrorMessage(data)
        dispatch(setMiniBackStatus({ id: row.id, status: MiniBackState.FAILED }))
        dispatch(rejectMiniBackLoading({ id: row.id }))
      })

      socketInstance?.on(`progress-deploy-mini-back-${row.id}`, data => {
        console.log('progress-deploy-mini-back', data)
        dispatch(setLoadingMiniBack({ miniBackId: row.id, loadingAmount: data }))
      })

      socketInstance?.on(`progress-delete-mini-back-${row.id}`, data => {
        dispatch(setLoadingMiniBack({ miniBackId: row.id, loadingAmount: data }))
      })

      socketInstance?.on(`finish-delete-mini-back-${row.id}`, data => {
        dispatch(successMiniBackLoading({ id: row.id }))
        dispatch(deleteMiniBackItem({ id: row.id }))
        dispatch(deleteMiniBackProjects({ id: row.id }))
      })

      socketInstance?.on(`finish-deploy-mini-back-${row.id}`, data => {
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
    dispatch(setLoadingMiniBack({ miniBackId: row.id, loadingAmount: 0 }))
    socket?.emit('delete-miniback', { id: row.id })
  }

  const handleDeploy = (event: SyntheticEvent) => {
    event.stopPropagation()
    dispatch(setLoadingMiniBack({ miniBackId: row.id, loadingAmount: 0 }))
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
      onDoubleClick={() => followToProjects(row.id)}
      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 }, "cursor": "pointer" }}
    >
      <TableCell>{index}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.serverUrl}</TableCell>
      <TableCell>{row.port}</TableCell>
      <TableCell>{row.deployState}</TableCell>

      <TableCell colSpan={4} sx={{ display: 'flex', justifyContent: 'space-around', columnGap: '15px' }} >
        {loading?.isLoading ?
          <CircularStatic value={loading.loadingAmount * 100} />
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