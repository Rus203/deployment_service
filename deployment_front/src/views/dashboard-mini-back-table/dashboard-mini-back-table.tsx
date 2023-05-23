import { Button } from '@mui/material'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMiniBack } from '../../interface/miniback.interface'
import { useGetMinibacksQuery } from '../../services'
import { MiniBackState } from '../../utils/mini-back-state.enum'
import TableItem from './table-item/table-item.component'
import { Container, FixedTable, LinkToDeploy } from './table.styles'

const DashBoardMiniBackTable: FC = () => {
  const navigate = useNavigate()
  const { data = [] } = useGetMinibacksQuery(undefined)

  const handleFollowToProjects = (miniBackId: string) => {
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
                  data.map((row: IMiniBack, index) => (
                    <TableItem key={index} index={index} row={row} followToProjects={handleFollowToProjects} />
                  )
                  )}
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
