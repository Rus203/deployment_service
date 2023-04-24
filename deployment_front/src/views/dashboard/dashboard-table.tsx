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
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMiniback } from '../../interface/miniback.interface'
import { useGetMinibacksQuery } from '../../services/miniback.api'
import { Container, LinkToDeploy, StyledCard } from './table.styles'




const DashboardTable: FC = () => {
  const { data = [] } = useGetMinibacksQuery(undefined)

  const navigate = useNavigate();

  return (
    <Container >
      <StyledCard>
        <TableContainer >
          <Table sx={{ minWidth: 500 }} aria-label='table in dashboard'>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Server Url</TableCell>
                <TableCell>Deploy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index: number) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 }, "cursor": "pointer" }}
                  onClick={() => {
                    navigate(`mini-back/${row.id}/projects/`)
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.name}</Typography>
                      {/* <Typography variant='caption'>{row.email}</Typography> */}
                    </Box>
                  </TableCell>
                  <TableCell>{row.serverUrl}</TableCell>
                  <TableCell>{row.isDeploy.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledCard>
      <LinkToDeploy href='/deploy'>
        <Button variant="contained">Create</Button>
      </LinkToDeploy>
    </Container>
  )
}

export default DashboardTable
