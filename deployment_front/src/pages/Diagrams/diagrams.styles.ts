import { styled } from "@mui/system";
import Box from "@mui/material/Box";

export const GraphsContainer = styled(Box)`
  height: 100%;
  width: 40%;
`;

export const TableContainer = styled(Box)`
  min-height: 100%;
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const Wrapper = styled("div")``;

export const Item = styled('div')`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  align-items: center;
`

export const Title = styled('h3')``

export const DiagramsContainer = styled('div')`
  width: 50%;
  min-height: 100%;
  display: flex;
  gap: 20px;
  justify-content: space-between;
`

export const Section = styled('section')`
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  margin: 10px auto;
`

export const SectionName = styled('h2')``;

export const Instance = styled('div')`
  background-color: #F2F3F4 ;
  padding: 10px 20px;
  border: 1px solid black;
  border-radius: 5px;
  margin-bottom: 30px;
`;
