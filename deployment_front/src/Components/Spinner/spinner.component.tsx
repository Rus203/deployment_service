import { ChasingDots } from "styled-spinkit";
import { Container, Wrapper } from "./spinner.styles";
import { MessageEvent } from "../../hooks";
import { Progress } from "../Progress";

interface IProps {
  typeOfMessages: MessageEvent | null;
}

const Spinner = ({ typeOfMessages }: IProps) => {
  return (
    <Container>
      {typeOfMessages && <Progress eventType={typeOfMessages} />}
      <Wrapper>
        <ChasingDots  size={40} color="black"/>
      </Wrapper>
    </Container>
  );
};

export default Spinner;
