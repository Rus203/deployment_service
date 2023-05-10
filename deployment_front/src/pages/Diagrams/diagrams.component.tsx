import { FC, useEffect, useState } from 'react';
import InfoTable from '../../Components/InfoTable/info-table.component';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  Wrapper,
  TableContainer,
  Item,
  Title,
  DiagramsContainer,
  Section,
  SectionName,
  Instance
} from './diagrams.styles';
import { useGetMinibacksQuery } from '../../services';
import axios from 'axios'
import { IStatistic } from '../../interface/statictic.interface';
import { IMiniBack } from '../../interface/miniback.interface';



const Diagrams: FC = () => {
  const [servers, setServers] = useState<IStatistic>()
  const { data: minibacks } = useGetMinibacksQuery(undefined)
  

  useEffect(() => {
    if (minibacks !== undefined) {
      console.log(minibacks)
      Promise.allSettled(minibacks.map((item: IMiniBack) => {
        const { port, serverUrl } = item
        return axios.get(`http://${serverUrl}:${port}/server/status`)
      }))
        .then(res => console.log(res))
        .catch(error => { console.log(error)})
    }
  }, [minibacks])

  return (
  <Wrapper>
    <Instance>
      <SectionName>Duck</SectionName>
      <Section>
        <DiagramsContainer>
        <Item>
          <Title>Ram</Title>
          <CircularProgressbar
            minValue={0}
            maxValue={100}
            styles={{ path: { stroke: '#ffb800'}, text: { fill: '#3a3541de'}}}
            value={34} // mock data
            text='567 gb' // mock data
          />
        </Item>
        <Item>
          <Title>Rom</Title>
          <CircularProgressbar
            minValue={0}
            maxValue={100}
            value={52} // mock data
            styles={{ path: { stroke: '#2dca73'}, text: { fill: '#3a3541de'}}}
            text='5477 mb' // mock data
            />
        </Item>
        <Item>
          <Title>CPU usage</Title>
          <CircularProgressbar
            minValue={0}
            maxValue={100}
            styles={{ text: { fill: '#3a3541de' }}}
            value={70} // mock data
            text='70%' // mock data
          />
        </Item>
        </DiagramsContainer>
        <TableContainer>
        <InfoTable />
        </TableContainer>
      </Section>
    </Instance>
  </Wrapper>)
  
};

export default Diagrams;