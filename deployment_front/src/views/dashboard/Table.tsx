
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { ThemeColor } from '../../@core/layouts/types'
import { useGetProjectsQuery } from '../../services'
import { IProject } from '../../interface/project.interface'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import { Container, LinkToDeploy } from './table.styles'

const DashboardTable = () => {
  const { data = [] } = useGetProjectsQuery(undefined)
  return (
    <Container>
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Git link</TableCell>
              <TableCell>Server URL</TableCell>
              <TableCell>Miniback URL</TableCell>
              {/* <TableCell>Status</TableCell> */}
              <TableCell>Project url</TableCell>
              <TableCell>button</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: IProject) => (
                <TableRow hover key={row.id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.name}</Typography>
                      <Typography variant='caption'>{row.email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.gitLink}</TableCell>
                  <TableCell>{row.sshServerUrl}</TableCell>
                  <TableCell>{row.minibackUrl}</TableCell>
                  <TableCell>{row.projectUrl}</TableCell>
                  <TableCell>
                    <Link to={`/deploy/${row.id}`}
                      style={{ 'textDecoration': 'none' }}
                    >
                      <Button
                        size="small"
                        variant="outlined">settings</Button>
                    </Link>
                  </TableCell>
                </TableRow>

            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
    <LinkToDeploy to='deploy'>
      <Button variant="contained">Create</Button>
    </LinkToDeploy>
    </Container>
  )
}

export default DashboardTable
