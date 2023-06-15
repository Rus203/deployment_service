import styled from 'styled-components'
import Link from '../../Components/Link/LInk'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 30px;
`

export const LinkToDeploy = styled(Link)`
  align-self: self-end;
  text-decoration: none;
`

export const FixedTable = styled.div`
  height: 70vh;
  overflow-y: auto;
`

export const ControlButtons = styled.div`
  display: flex;
  column-gap: 20px;
  justify-content: flex-end;
`
export const SpinBlock = styled.div`
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
