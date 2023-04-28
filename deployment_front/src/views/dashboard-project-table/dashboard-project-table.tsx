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
import { IProject } from '../../interface/project.interface'
import { Container, LinkToDeploy, FixedTable } from './table.styles'


const DashBoardProjectTable: FC = () => {
  // const { data = [] } = useGetProjectsQuery(undefined)
  const data: IProject[] = [
    // mock data
    {
      id: '61f0c404-5cb3-11e7-907b-a6006ad3dba0',
      email: 'test@gmail.com',
      port: 10000,
      name: 'test',
      gitLink: 'git@github.com:Rus203/mini_back.git',
      isDeploy: true
    }, 
    {
      id: '61f0c404-5cb3-11e7-907b-a6006ad3dba0',
      email: 'test@gmail.com',
      port: 10000,
      name: 'test',
      gitLink: 'git@github.com:Rus203/mini_back.git',
      isDeploy: true
    },
    {
      id: '61f0c404-5cb3-11e7-907b-a6006ad3dba0',
      email: 'test@gmail.com',
      port: 10000,
      name: 'test',
      gitLink: 'git@github.com:Rus203/mini_back.git',
      isDeploy: true
    },
    {
      id: '61f0c404-5cb3-11e7-907b-a6006ad3dba0',
      email: 'test@gmail.com',
      port: 10000,
      name: 'test',
      gitLink: 'git@github.com:Rus203/mini_back.git',
      isDeploy: true
    }
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
                <TableCell>Git link</TableCell>
                <TableCell>Port</TableCell>
                <TableCell>Status</TableCell>
                <TableCell colSpan={4} align='center'>Controls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                data.map((row: IProject, index) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 }, "cursor": "pointer" }}
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
      <LinkToDeploy href='/deploy'>
        <Button variant="contained">Create</Button>
      </LinkToDeploy>
    </Container>
  )
}

export default DashBoardProjectTable
