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
import { useGetProjectsQuery } from '../../services'
import { Container, LinkToDeploy } from './table.styles'


interface IProps {

}

const DashboardTable: FC = () => {
  const { data = [{
    id: "1",
    name: "string",
    email: "12321",
    sshServerUrl: "string",
    sshGitPrivateKey: "string",
    sshGitPublicKey: "string",
    gitLink: "string",
    envFile: "string",
    sshFile: "string",
    uploadPath: "string",
    projectUrl: "string", //-
    minibackUrl: "string", //-

  }, {
    id: "2",
    name: "string",
    email: "string",
    sshServerUrl: "string",
    sshGitPrivateKey: "string",
    sshGitPublicKey: "string",
    gitLink: "string",
    envFile: "string",
    sshFile: "string",
    uploadPath: "string",
    projectUrl: "string",
    minibackUrl: "string",

  }, {
    id: "3",
    name: "string",
    email: "string",
    sshServerUrl: "string",
    sshGitPrivateKey: "string",
    sshGitPublicKey: "string",
    gitLink: "string",
    envFile: "string",
    sshFile: "string",
    uploadPath: "string",
    projectUrl: "string",
    minibackUrl: "string",

  }, {
    id: "4",
    name: "string",
    email: "string",
    sshServerUrl: "string",
    sshGitPrivateKey: "string",
    sshGitPublicKey: "string",
    gitLink: "string",
    envFile: "string",
    sshFile: "string",
    uploadPath: "string",
    projectUrl: "string",
    minibackUrl: "string",

  },] } = useGetProjectsQuery(undefined)

  const navigate = useNavigate();

  return (
    <Container>
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Git link</TableCell>
                <TableCell>Server URL</TableCell>
                <TableCell>Miniback URL</TableCell>
                {/* <TableCell>Status</TableCell> */}
                <TableCell>Project url</TableCell>
                {/* <TableCell>button</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: IProject, index) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 }, "cursor": "pointer" }}
                  onClick={() => {
                    navigate(`deploy/${row.id}`)
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
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
                  {/* <TableCell>
                    <Link href={`/deploy/${row.id}`}
                      style={{ 'textDecoration': 'none' }}
                    >
                      <Button
                        size="small"
                        variant="outlined">settings</Button>
                    </Link>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <LinkToDeploy href='/deploy'>
        <Button variant="contained">Create</Button>
      </LinkToDeploy>
    </Container>
  )
}

export default DashboardTable
