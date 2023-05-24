import { Button } from '@mui/material'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { FC } from 'react'
import { useGetMinibackQuery, useGetProjectsQuery } from '../../services'
import TableItemProject from './table-item-project/table-item-project'
import { Container, ControlButtons, FixedTable, LinkToDeploy } from './table.styles'
import { useLocation } from 'react-router-dom'
import { IProject } from '../../interface/project.interface'

const DashBoardProjectTable: FC = () => {
  const location = useLocation()
  const miniBackId = location.pathname.split('/')[2]
  const { data: miniback } = useGetMinibackQuery({ id: miniBackId })
  const { data: projects, isFetching } = useGetProjectsQuery({ serverUrl: miniback?.serverUrl, port: miniback?.port })


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
                {(projects !== undefined && projects.map((row: any, index: number) => (
                  <TableItemProject key={index} index={index} isFetching={isFetching} row={row} miniback={miniback}/>
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