import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { FC, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Spinner from '../../Components/Spinner'
import { IProject } from '../../interface/project.interface'
import { useDeleteProjectMutation, useDeployProjectMutation, useGetMinibackQuery, useGetProjectsQuery } from '../../services'
import { ProjectState } from '../../utils/project-state.enum'
import { Container, ControlButtons, FixedTable, LinkToDeploy } from './table.styles'

const DashBoardProjectTable: FC = () => {
  const location = useLocation()
  const miniBackId = location.pathname.split('/')[2]
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { data: miniback } = useGetMinibackQuery({ id: miniBackId })
  const { data: projects, isFetching } = useGetProjectsQuery({ serverUrl: miniback?.serverUrl, port: miniback?.port })
  const [deleteProject] = useDeleteProjectMutation();
  const [deployProject] = useDeployProjectMutation();

  const handleDeploy = (project: IProject) => {
    const { id } = project
    setIsLoading(true)
    deployProject({
      serverUrl: miniback?.serverUrl, port: miniback?.port, id
    })
      .catch(e => console.log(e))
      .finally(() => setIsLoading(false))
  }

  const handleDelete = (project: IProject) => {
    const { id } = project
    setIsLoading(true)
    deleteProject({
      serverUrl: miniback?.serverUrl, port: miniback?.port, id
    })
      .catch(e => console.log(e))
      .finally(() => setIsLoading(false))
  }

  return (
    <Container>
      <Card>
        <TableContainer>
          <FixedTable>
            <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
              <TableHead>
                <TableRow>
                  <TableCell>№</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Git link</TableCell>
                  <TableCell>Port</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell colSpan={4} align='center'>Controls</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isFetching || isLoading ?
                  <tr><td colSpan={6}><Spinner typeOfMessages={null} /></td></tr>
                  :
                  (projects !== undefined && projects.map((row, index) => (
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
                        <Button
                          variant='outlined'
                          disabled={row.state !== ProjectState.UNDEPLOYED}
                          onClick={() => handleDeploy(row)}
                        >Deploy</Button>
                        <Button
                          onClick={() => handleDelete(row)}
                          variant='outlined'
                          color='error'
                        >
                          Delete</Button>
                      </TableCell>
                    </TableRow>
                  )))
                }

              </TableBody>
            </Table>
          </FixedTable>
        </TableContainer>
      </Card>
      <ControlButtons>
        <LinkToDeploy href='/'>
          <Button variant="contained">Back</Button>
        </LinkToDeploy>
        <LinkToDeploy href='project'>
          <Button variant="contained">Create</Button>
        </LinkToDeploy>
      </ControlButtons>
    </Container>
  )
}

export default DashBoardProjectTable