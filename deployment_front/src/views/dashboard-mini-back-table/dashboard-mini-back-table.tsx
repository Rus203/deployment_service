import { FC } from 'react'
import { Button } from '@mui/material'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { IMiniBack } from '../../interface/miniback.interface'
import { Container, LinkToDeploy, FixedTable } from './table.styles'
import { useGetMinibacksQuery, useDeleteMinibackMutation, useDeployMinibackMutation } from '../../services'
import { MiniBackState } from '../../utils/mini-back-state.enum'
import Spinner from '../../Components/Spinner'
import { useNavigate } from 'react-router-dom'

const DashBoardMiniBackTable: FC = () => {
  const navigate = useNavigate()
  const { data = [] } = useGetMinibacksQuery(undefined)

  const [ deleteMiniBack , { isLoading: isLoadingDelete }] = useDeleteMinibackMutation()
  const [ deployMiniBack, { isLoading: isLoadingDeploy }] = useDeployMinibackMutation()

  const followToProjects = (miniBackId: string) => {
    const miniBackItem = data.find(item => item.id === miniBackId)
    if (miniBackItem?.deployState === MiniBackState.DEPLOYED) {
      navigate(`/mini-back/${miniBackId}`)
    }
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
              <TableCell>Server url</TableCell>
              <TableCell>Port</TableCell>
              <TableCell>Status</TableCell>
              <TableCell colSpan={4} align='center'>Controls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              isLoadingDelete || isLoadingDeploy
                ? <Spinner typeOfMessages={null}  />
                : (
                data.map((row: IMiniBack, index) => (
                <TableRow
                  hover
                  key={row.id}
                  onClick={() => followToProjects(row.id)}
                  sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 }, "cursor": "pointer" }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.serverUrl}</TableCell>
                  <TableCell>{row.port}</TableCell>
                  <TableCell>{row.deployState}</TableCell>
                  <TableCell colSpan={4} sx={{ display: 'flex', justifyContent: 'space-around', columnGap: '15px' }} >
                    <Button
                      variant='outlined'
                      onClick={() => deployMiniBack(row.id)}
                      disabled={row.deployState === MiniBackState.DEPLOYED
                        || row.deployState === MiniBackState.FAILED}
                      >
                        Deploy
                      </Button>
                    <Button
                      onClick={() => deleteMiniBack(row.id)}
                      variant='outlined'
                      color='error'
                      >
                        Delete
                      </Button>
                  </TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
        </FixedTable>
      </TableContainer>
      </Card>
      
      <LinkToDeploy href='/mini-back'>
        <Button variant="contained">Create</Button>
      </LinkToDeploy>
    </Container>
  )
}

export default DashBoardMiniBackTable
