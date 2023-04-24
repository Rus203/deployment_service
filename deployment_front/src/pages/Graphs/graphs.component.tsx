import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import GraphPie from '../../Components/GraphPie/graph-pie.components';
import InfoTable from '../../Components/InfoTable/info-table.component';
import { GraphsContainer, TableContainer, Wrapper } from './graphs.styles';



const Graphs: FC<{ hasAccess: boolean }> = ({ hasAccess }) => {

  const data1 = [
    {
      "name": "Free RAM",
      "uv": 50,
      "fill": "#FF2E63"
    },
    {
      "name": "Total RAM",
      "uv": 100,
      "fill": "#08D9D6"
    }
  ]
  const data2 = [
    {
      "name": "Free ROM",
      "uv": 50,
      "fill": "#2D4059"
    },
    {
      "name": "Total ROM",
      "uv": 100,
      "fill": "#EA5455"
    }
  ]
  const data3 = [
    {
      "name": "Free CPU",
      "uv": 50,
      "fill": "#521262"
    },
    {
      "name": "Total CPU",
      "uv": 100,
      "fill": "#FFBD39"
    }
  ]


  return !hasAccess
    ? <Navigate to="/login" replace={true} />
    : <Wrapper>
      <GraphsContainer>
        <GraphPie data={data1} />
        <GraphPie data={data2} />
        <GraphPie data={data3} />
      </GraphsContainer>
      <TableContainer>
        <InfoTable />
      </TableContainer>
    </Wrapper>
};

export default Graphs;