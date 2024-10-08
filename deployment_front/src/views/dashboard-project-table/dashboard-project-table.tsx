import { Button } from '@mui/material'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { FC, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TableItemProject from './table-item-project/table-item-project'
import { Container, ControlButtons, FixedTable, LinkToDeploy, SpinBlock } from './table.styles'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import axios from 'axios'
import { setProjectCollection } from '../../store/Slices/project.slice'
import { IProject } from '../../interface/project.interface'
import Spinner from '../../Components/Spinner'
import HealthCheck from '../../Components/Heath-Check'

const DashBoardProjectTable: FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const location = useLocation()
  const miniBackId = location.pathname.split('/')[2]
  const miniBack = useAppSelector(state => state.miniBack.miniBackCollection)
    .find(item => item.id === miniBackId)
  const dispatch = useAppDispatch()
  const projects = useAppSelector(state => state.project.projectCollection)
  const host = useAppSelector(state => state.health.host)

  useLayoutEffect(() => {
    if (miniBack) {
      setLoading(true)
      const { port, serverUrl } = miniBack
      axios.get(`http://${serverUrl}:${port}/project`)
        .then(res => {
          dispatch(setProjectCollection({ projects: res.data, miniBackId: miniBack.id }))
        })
        .catch(error => { console.log(error) })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [])

  return miniBack ? (
    <>
      <Container>
        <Card>
          <TableContainer>
            <FixedTable>
              { loading ? <SpinBlock><Spinner /></SpinBlock> : (
                <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
                <TableHead>
                  <TableRow>
                    <TableCell>№</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Git link</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell colSpan={4} align='center'>Controls</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(projects !== undefined && projects.map((project: IProject, index: number) => (
                    <TableItemProject
                      key={project.id}
                      index={index + 1}
                      project={project}
                      serverUrl={miniBack.serverUrl}
                      port={miniBack.port}
                    />
                  )))}
                </TableBody>
              </Table>
              )}
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
      { host ? <HealthCheck host={host} /> : null }
    </>
  ) : null
}

export default DashBoardProjectTable