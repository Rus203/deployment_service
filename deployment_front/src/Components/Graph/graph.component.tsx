import { FC } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Props = {
  name: string;
  data: object[];
}

const Graph: FC<Props> = ({ data, name }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey={name} stroke="#8884d8" fill="#8884d0" activeDot={{ r: 8 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Graph;