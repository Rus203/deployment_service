import { ChasingDots } from "styled-spinkit";
import { Container, Wrapper } from "./spinner.styles";
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <Container>
      <Wrapper>
        <ChasingDots  size={40} color="black"/>
      </Wrapper>
    </Container>
  );
};

export default Spinner;
