import { Button, TableCell, TableRow } from '@mui/material';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import Spinner from '../../../Components/Spinner';
import { IMiniBack } from '../../../interface/miniback.interface';
import { MiniBackState } from '../../../utils/mini-back-state.enum';
import io, { Socket } from 'socket.io-client'
import { useAppSelector } from '../../../store/hooks';

type Props = {
  row: IMiniBack,
  index: number,
  followToProjects: (miniBackId: string) => void
}

const TableItem: FC<Props> = ({ row, index, followToProjects }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [socket, setSocket] = useState<Socket>()
  const account = useAppSelector(state => state.auth.account)

  useEffect(() => {
    if (account) {
      const url = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_SOCKET_BACK_DEPLOYMENT_URL!
      : process.env.REACT_APP_SOCKET_BACK_DEV_URL!

    console.log(url + `?token=${account.accessToken}`)
    const socketInstance = io(url + `?token=${account.accessToken}`)
    setSocket(socketInstance)

    socket?.on('error', data => { console.log('errors ', data) })

    return () => { socketInstance.disconnect() }
    }
  }, [])

  const handleDelete = (event: SyntheticEvent) => {
    event.stopPropagation()
    // TODO: rebuild this one vai sockets
  }

  const handleDeploy = (event: SyntheticEvent) => {
    event.stopPropagation()
    console.log('I am emitting right now')
    socket?.emit('deploy-project', { id: row.id})
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
          // There was spinner here
            <Button
              variant='outlined'
              onClick={(event) => handleDeploy(event) }
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