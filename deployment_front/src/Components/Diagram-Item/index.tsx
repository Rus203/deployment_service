import { FC } from "react";
import { IMiniBack } from "../../interface/miniback.interface";
import DiagramItem from "./diagram-item.component";



interface IProps {
  miniback: IMiniBack;
}

const Component: FC<IProps> = ({ miniback }) => {
  return <DiagramItem miniback={miniback}/>;
};

export default Component;
