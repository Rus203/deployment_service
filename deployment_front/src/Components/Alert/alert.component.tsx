import React, { FC } from 'react';
import { Alert as AlertMUI } from "@mui/material";
import { StyledAlertContainer } from './alert.styles';

type Props = {
  error: string
}

const Alert: FC<Props> = ({ error }) => {
  return (
    <StyledAlertContainer>
      <AlertMUI severity="error">{error}</AlertMUI>
    </StyledAlertContainer>
  );
};

export default Alert;