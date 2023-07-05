import { FC } from "react";

import CircularStatic from "./circular-progress-with-label.component";




interface IProps {
  value: number;
}

const Component: FC<IProps> = ({ value }) => {
  return <CircularStatic value={value}/>;
};

export default Component;