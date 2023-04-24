import styled from 'styled-components'
import Link from '../../Components/Link/LInk'
import Card from '@mui/material/Card'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  row-gap: 30px;
`

export const LinkToDeploy = styled(Link)`
  align-self: self-end;
  text-decoration: none;
`
export const StyledCard = styled(Card)`
  max-width: 100%;

`
