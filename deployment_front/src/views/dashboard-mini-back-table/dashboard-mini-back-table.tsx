import { Button } from '@mui/material'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { FC, useState, useEffect } from 'react'
import axios from '../../utils/axios.instance'
import { useNavigate } from 'react-router-dom'
import { IMiniBack } from '../../interface/miniback.interface'
import { MiniBackState } from '../../utils/mini-back-state.enum'
import TableItem from './table-item/table-item.component'
import { Container, FixedTable, LinkToDeploy } from './table.styles'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addMiniBackCollection, setMiniBackCollection } from '../../store/Slices'

const DashBoardMiniBackTable: FC = () => {
  const { miniBackCollection } = useAppSelector(state => state.miniBack)
  const dispatch = useAppDispatch()

  useEffect(() => {
    axios.get('mini-back')
      .then(res => {
        setMiniBackCollection(res.data)
        dispatch(addMiniBackCollection(res.data))
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const navigate = useNavigate()

  const handleFollowToProjects = (miniBackId: string) => {
    const miniBackItem = miniBackCollection.find(item => item.id === miniBackId)
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
                  miniBackCollection.map((row: IMiniBack, index) => (
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
