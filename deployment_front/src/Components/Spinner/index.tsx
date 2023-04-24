import Spinner from "./spinner.component";

import { MessageEvent } from "../../hooks";

interface IProps {
  typeOfMessages: MessageEvent | null;
}

const Component = ({ typeOfMessages }: IProps) => {
  return <Spinner typeOfMessages={typeOfMessages} />;
};

export default Component;
