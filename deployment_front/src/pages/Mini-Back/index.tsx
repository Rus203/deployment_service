import { FC } from "react";
import { MiniBack} from "./mini-back.component";

const Component: FC<{ hasAccess: boolean }> = ({ hasAccess = false }) => {
  return <MiniBack hasAccess={hasAccess} />;
};

export default Component;
