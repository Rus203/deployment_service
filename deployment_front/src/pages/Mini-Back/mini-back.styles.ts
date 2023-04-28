import styled from "styled-components";
import {
  FormControl as MuiFormControl,
  FormHelperText as MuiFormHelperText,
} from "@mui/material";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const FormContainer = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 30px;
`;

export const SelectProjectsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ProjectOptionsContainer = styled.form`
  display: flex;
  flex-direction: column;
  flex: 4;
  gap: 10px;
`;

export const StatisticsContainer = styled.div`
  flex: 4;
  margin-top: 30px;
`;

export const FormControl = styled(MuiFormControl)`
  width: 30%;
`;

export const FileInput = styled.input.attrs({
  type: "file",
})`
  display: none;
`;

export const Section = styled.div`
  & + & {
    margin-top: 20px;
  }
`;

export const SectionHeader = styled.h3`
  margin: 0 0 5px 0;
  padding: 0;
`;

export const SectionInputs = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const ButtonsContainer = styled.div`
  margin-top: 30px ;
  display: flex;
  column-gap: 30px;
`;

export const FormHelperText = styled(MuiFormHelperText)`
  position: absolute;
  bottom: -50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-transform: none;
`;

