import { styled } from "@mui/system";
import Box from "@mui/material/Box";

export const BoxStyled = styled(Box)`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledAlertContainer = styled(Box)`
  position: absolute;
  top: 1.5%;
  left: 0;
  right: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`