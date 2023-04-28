import { FC } from "react";
import { Project } from "./project.component";

const Component: FC<{ hasAccess: boolean }> = ({ hasAccess = false }) => {
  return <Project hasAccess={hasAccess} />;
};

export default Component;
