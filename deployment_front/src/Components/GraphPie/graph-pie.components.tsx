import { FC } from 'react';
import { Legend, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ResponsiveContainerStyled } from './graph-pie.styles';

interface Props {
  data: {
    "name": string,
    "uv": number,
    "fill": string
  }[]
}


const GraphPie: FC<Props> = ({ data }) => {


  return (
    <ResponsiveContainerStyled>
      <RadialBarChart
        innerRadius="10%"
        outerRadius="80%"
        data={data}
        startAngle={180}
        endAngle={0}
        barCategoryGap={1}

      >
        <RadialBar label={{ fill: '#666', position: 'insideStart' }} background dataKey='uv' />
        <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
        <Tooltip />
      </RadialBarChart>
    </ResponsiveContainerStyled>
  );
};

export default GraphPie;