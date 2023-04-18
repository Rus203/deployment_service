import React from "react";
import ProjectStats from "./project-stats.component";

const Component: React.FC<{ projectId: string }> = ({ projectId }) => {
  return <ProjectStats projectId={projectId} />;
};

export default Component;
