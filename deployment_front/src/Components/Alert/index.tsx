import { FC } from "react";
import Alert from "./alert.component";



interface IProps {
  error: string;
}

const Component: FC<IProps> = ({ error }) => {
  return <Alert error={error}/>;
};

export default Component;
