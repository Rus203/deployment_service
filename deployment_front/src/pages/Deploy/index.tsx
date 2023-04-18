import { FC } from "react";
import { Deploy } from "./deploy.component";

const Component: FC<{ hasAccess: boolean }> = ({ hasAccess = false }) => {
  return <Deploy hasAccess={hasAccess} />;
};

export default Component;
