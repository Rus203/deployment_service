import { Box, Button, TableCell, TableRow, Typography } from '@mui/material';
import { FC, useState, useEffect, SyntheticEvent } from 'react';
import { IProject } from '../../../interface/project.interface';
import { ProjectState } from '../../../utils/project-state.enum';
import io, { Socket } from 'socket.io-client'
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import Alert from '../../../Components/Alert';
import CircularStatic from '../../../Components/CircularProgressWithLabel/circular-progress-with-label.component';
import {
  deleteProjectItem,
  rejectProjectLoading,
  setProjectLoading,
  setProjectStatus,
  successProjectLoading } from '../../../store/Slices/project.slice';

interface Props {
  index: number,
  project: IProject,
  serverUrl: string,
  port: number
}

const TableItemProject: FC<Props> = ({ index, project, serverUrl, port }) => {
  const [loadingAmount, setLoadingAmount] = useState<number>(0)
  const [socket, setSocket] = useState<Socket>()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.project.projectCollection)
    .find(el => el.id === project.id)?.isLoading


    const handleDelete = (event: SyntheticEvent) => {
      event.stopPropagation()
      console.log('delete-project')
      dispatch(setProjectLoading({ id: project.id }))
      socket?.emit('delete-project', { id: project.id })
    }
  
    const handleDeploy = (event: SyntheticEvent) => {
      event.stopPropagation()
      dispatch(setProjectLoading({ id: project.id }))
      socket?.emit(`deploy-project`, { id: project.id })
    }

  useEffect(() => {
    const url = `http://${serverUrl}:${port}`
      const socketInstance = io(url)
      setSocket(socketInstance)

      socketInstance?.on(`error-${project.id}`, data => {
        console.log('errors ', data)
        setIsShowAlert(true)
        setErrorMessage(data)
        dispatch(setProjectStatus({ id: project.id, status: ProjectState.FAILED }))
        dispatch(rejectProjectLoading({ id: project.id }))
      })

      socketInstance?.on(`progress-deploy-project-${project.id}`, data => {
        console.log(data)
        setLoadingAmount(data)
      })

      socketInstance?.on(`progress-delete-project-${project.id}`, data => {
        console.log(data)
        dispatch(setProjectLoading({ id: project.id }))
        setLoadingAmount(data)
      })

      socketInstance?.on(`finish-delete-project-${project.id}`, data => {
        console.log("finish-delete")
        dispatch(successProjectLoading({ id: project.id }))
        dispatch(deleteProjectItem({ id: project.id }))
      })

      socketInstance?.on(`finish-deploy-project-${project.id}`, data => {
        console.log('finish-deploy')
        dispatch(successProjectLoading({ id: project.id }))
        dispatch(setProjectStatus({ id: project.id, status: ProjectState.DEPLOYED }))
      })

      return () => { socketInstance.disconnect() }
    }
  , [])

  useEffect(() => {
    if (isShowAlert) {
      const timerId = setTimeout(() => setIsShowAlert(false), 10000);
      return () => clearTimeout(timerId);
    }
  }, [isShowAlert])

  return (
    <TableRow
      hover
      key={index}
      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
    >
      <TableCell>{index + 1}</TableCell>
      <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{project.name}</Typography>
          <Typography variant='caption'>{project.email}</Typography>
        </Box>
      </TableCell>
      <TableCell>{project.gitLink}</TableCell>
      <TableCell>{project.state}</TableCell>
      <TableCell colSpan={4} sx={{ display: 'flex', justifyContent: 'space-around', columnGap: '15px' }} >
      {loading ?
          <CircularStatic value={loadingAmount * 100} />
          :
          <>
            <Button
              variant='outlined'
              disabled={project.state === ProjectState.DEPLOYED
                || project.state === ProjectState.FAILED}
              onClick={handleDeploy}
            >Deploy</Button>
            <Button
              onClick={handleDelete}
              variant='outlined'
              color='error'
            >
              Delete</Button>
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
};

export default TableItemProject;