import { FC, useEffect, useState } from "react";
import Spinner from "../Spinner/spinner.component";
import { ColoredSpan, Container, StatHeader } from "./project-stats.styles";

interface ProjectStatsProps {
  projectId: string;
}

const ProjectStats: FC<ProjectStatsProps> = ({
  projectId,
}: ProjectStatsProps) => {
  const [projectState, setProjectState] = useState<{
    isRunning: boolean;
    totalMemory: number;
    freeMemory: number;
  }>();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    //TODO: use getStats endpoint
    setLoading(true);
    setTimeout(() => {
      setProjectState({
        isRunning: true,
        totalMemory: 350,
        freeMemory: 241.4,
      });
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Container>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          <StatHeader>
            Is Running:{" "}
            {projectState?.isRunning ? (
              <ColoredSpan color="green">True</ColoredSpan>
            ) : (
              <ColoredSpan color="red">False</ColoredSpan>
            )}
          </StatHeader>
          <StatHeader>
            Total Memory: <span>{projectState?.totalMemory}</span> Mb
          </StatHeader>
          <StatHeader>
            Free Memory: <span>{projectState?.freeMemory}</span>
          </StatHeader>
        </div>
      )}
    </Container>
  );
};

export default ProjectStats;
