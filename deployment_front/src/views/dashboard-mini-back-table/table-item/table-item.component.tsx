import { Button, TableCell, TableRow } from '@mui/material';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import Spinner from '../../../Components/Spinner';
import { IMiniBack } from '../../../interface/miniback.interface';
import { MiniBackState } from '../../../utils/mini-back-state.enum';
import io, { Socket } from 'socket.io-client'
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { deleteMiniBackItem, setMiniBackStatus } from '../../../store/Slices';
import CircularStatic from '../../../Components/CircularProgressWithLabel/circular-progress-with-label.component';
import { DeployStatusMiniBack } from '../../../utils/server-status.enum';
import Alert from '../../../Components/Alert';

type Props = {
  row: IMiniBack,
  index: number,
  followToProjects: (miniBackId: string) => void
}

const TableItem: FC<Props> = ({ row, index, followToProjects }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingAmount, setLoadingAmount] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false)
  const [socket, setSocket] = useState<Socket>()
  const account = useAppSelector(state => state.auth.account)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      const url = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_SOCKET_BACK_DEPLOYMENT_URL!
        : process.env.REACT_APP_SOCKET_BACK_DEV_URL!

      console.log(url + `?token=${account.accessToken}`)
      const socketInstance = io(url + `?token=${account.accessToken}`)
      setSocket(socketInstance)

      socketInstance?.on('error', data => {
        console.log('errors ', data)
        setIsShowAlert(true)
        setErrorMessage(data)
        dispatch(setMiniBackStatus({ id: row.id, status: MiniBackState.FAILED }))
        setLoading(false)
      })

      socketInstance?.on('progress-deploy-mini-back', data => {
        console.log(data)
        setLoadingAmount(data)
      })

      socketInstance?.on('progress-deploy-mini-back', data => {
        console.log(data)
        setLoadingAmount(data)
      })

      socketInstance?.on('finish-delete', data => {
        console.log("finish-delete")
        setLoading(false)
        dispatch(deleteMiniBackItem({ id: row.id }))
      })

      socketInstance?.on('finish-deploy', data => {
        console.log('finish-deploy')
        setLoading(false)
        dispatch(setMiniBackStatus({ id: row.id, status: MiniBackState.DEPLOYED }))
      })

      return () => { socketInstance.disconnect() }
    }
  }, [])

  const handleDelete = (event: SyntheticEvent) => {
    event.stopPropagation()
    console.log("first")
    setLoading(true)
    socket?.emit('delete-miniback', { id: row.id })
  }

  const handleDeploy = (event: SyntheticEvent) => {
    event.stopPropagation()
    setLoading(true)
    socket?.emit('deploy-miniback', { id: row.id })
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
      <TableCell>{index + 1}</TableCell>
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
      {/* {(errorMessage !== null && isShowAlert)
        ?
        <TableCell><Alert error={errorMessage} /></TableCell>
        : null
      } */}
    </TableRow>

  );
}


export default TableItem;