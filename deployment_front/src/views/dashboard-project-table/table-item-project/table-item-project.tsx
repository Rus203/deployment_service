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
  setProjectStatus,
  setLoadingAmount,
  successProjectLoading } from '../../../store/Slices/project.slice';

interface Props {
  index: number,
  project: IProject,
  serverUrl: string,
  port: number
}

const TableItemProject: FC<Props> = ({ index, project, serverUrl, port }) => {
  const [socket, setSocket] = useState<Socket>()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.project.projectCollection)
    .find(el => el.id === project.id)


    const handleDelete = (event: SyntheticEvent) => {
      event.stopPropagation()
      dispatch(setLoadingAmount({ projectId: project.id, loadingAmount: 0 }))
      socket?.emit('delete-project', { id: project.id })
    }
  
    const handleDeploy = (event: SyntheticEvent) => {
      event.stopPropagation()
      dispatch(setLoadingAmount({ projectId: project.id, loadingAmount: 0 }))
      socket?.emit(`deploy-project`, { id: project.id })
    }

  useEffect(() => {
    const url = `http://${serverUrl}:${port}`
      const socketInstance = io(url)
      setSocket(socketInstance)

      socketInstance?.on(`error-${project.id}`, data => {
        setIsShowAlert(true)
        setErrorMessage(data)
        dispatch(setProjectStatus({ id: project.id, status: ProjectState.FAILED }))
        dispatch(rejectProjectLoading({ id: project.id }))
      })

      socketInstance?.on(`progress-deploy-project-${project.id}`, data => {
        dispatch(setLoadingAmount({ projectId: project.id, loadingAmount: data}))
        setLoadingAmount(data)
      })

      socketInstance?.on(`progress-delete-project-${project.id}`, data => {
        dispatch(setLoadingAmount({ projectId: project.id, loadingAmount: data}))
        setLoadingAmount(data)
      })

      socketInstance?.on(`finish-delete-project-${project.id}`, data => {
        dispatch(deleteProjectItem({ id: project.id }))
      })

      socketInstance?.on(`finish-deploy-project-${project.id}`, data => {

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
      <TableCell>{index}</TableCell>
      <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{project.name}</Typography>
          <Typography variant='caption'>{project.email}</Typography>
        </Box>
      </TableCell>
      <TableCell>{project.gitLink}</TableCell>
      <TableCell>{project.state}</TableCell>
      <TableCell colSpan={4} sx={{ display: 'flex', justifyContent: 'space-around', columnGap: '15px' }} >
      {loading?.isLoading ?
          <CircularStatic value={loading.loadingAmount * 100} />
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