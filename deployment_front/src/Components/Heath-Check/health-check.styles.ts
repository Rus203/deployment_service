import styled from 'styled-components'
import {  FormHelperText as MuiFormHelperText } from '@mui/material'

export const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`

export const Wrapper = styled.div`
  width: 40%;
  height: 27%;
  background-color: #F4F5FA;
  position: absolute;
  top: 23%;
  left: 40%;
  border-radius: 3px;
`

export const Section = styled.section`
  padding: 25px 30px 60px 30px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  justify-content: center; 
`

export const SectionHeader = styled.h3`
  margin-bottom: 15px;
`

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
`

export const ControlBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  top: 40px;
`

export const FormHelperText = styled(MuiFormHelperText)`
  position: absolute;
  bottom: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-transform: none;
`
