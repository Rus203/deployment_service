import { FC } from 'react'
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
import { useNavigate } from 'react-router-dom'
import { IMiniBack } from '../../interface/miniback.interface'
import { Container, LinkToDeploy, FixedTable } from './table.styles'


const DashBoardMiniBackTable: FC = () => {
  // const { data = [] } = useGetProjectsQuery(undefined)
  const data: IMiniBack[] = [
    // mock data
    {
      id: '61f0c404-5cb3-11e7-907b-a6006ad3dba0',
      name: 'test',
      serverUrl: '46.101.110.15',
      nameRemoteRepository: 'project',
      userId: 'b073db8a-a6ce-448c-8dc1-28fc17e88a44',
      isDeploy: true
    }, 
    {
      id: '61f0c404-5cb3-11e7-907b-a6006ad3dba0',
      name: 'Kranky',
      serverUrl: '75.155.110.95',
      nameRemoteRepository: 'project',
      userId: 'b073db8a-a6ce-448c-8dc1-28fc17e88a44',
      isDeploy: true
    },
    {
      id: '61f0c404-5cb3-11e7-907b-a6006ad3dba0',
      name: 'ducky',
      serverUrl: '146.171.191.159',
      nameRemoteRepository: 'project',
      userId: 'b073db8a-a6ce-448c-8dc1-28fc17e88a44',
      isDeploy: false
    },
  ]

  const navigate = useNavigate();

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
                <TableCell>Repository name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell colSpan={4} align='center'>Controls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                data.map((row: IMiniBack, index) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 }, "cursor": "pointer" }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.serverUrl}</TableCell>
                  <TableCell>{row.nameRemoteRepository}</TableCell>
                  <TableCell>{row.isDeploy ? 'deployed' : 'not deployed'}</TableCell>
                  <TableCell colSpan={4} sx={{ display: 'flex', justifyContent: 'space-around', columnGap: '15px' }} >
                    <Button variant='outlined' disabled={row.isDeploy}>Deploy</Button>
                    <Button variant='outlined' disabled={!row.isDeploy}>Run</Button>
                    <Button  variant='outlined' color='error' disabled={!row.isDeploy}>Delete</Button>
                  </TableCell>
                </TableRow>
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
