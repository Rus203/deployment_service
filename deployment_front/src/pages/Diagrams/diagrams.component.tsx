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
import { getByPattern } from '../../utils/getByPattern';


const Diagrams: FC = () => {
  const [servers, setServers] = useState<IStatistic[]>([{
    status: "fulfilled",
    value: {
      rom: { totalSpace: "0Gb", usedSpace: "0Gb" },
      ram: { totalMemory: "0Gb", usedMemory: "0Gb" },
      cpuUsage: 1
    }

  }])
  const { data: minibacks } = useGetMinibacksQuery(undefined)


  useEffect(() => {
    if (minibacks !== undefined) {
      Promise.allSettled(minibacks.map((item: IMiniBack): Promise<any> => {
        const { port, serverUrl } = item
        return axios.get(`http://${serverUrl}:${port}/server/status`).then(response => response.data);
      }))
        .then((res: any) => {
          console.log(res)
          setServers(res)
        })
        .then(() => console.log(servers))
        .catch(error => { console.log(error) })
    }
  }, [minibacks])

  const converterToGb = (total: string, current: string): number => {
    const translate = (value: string, type: string): any => {
      type = type.toLowerCase()
      return {
        "gb": +value,
        "g": +value,
        "mb": +value / 1000,
        "m": +value / 1000,
      }[type]?.toFixed(1)
    }


    if (total && current) {
      const [fullSize, totalMeasure] = [getByPattern(total, /[0-9.]+/g), getByPattern(total, /[a-zA-Z]/g)]
      const [currentSize, currentMeasure] = [getByPattern(current,/[0-9.]+/g), getByPattern(current, /[a-zA-Z]/g)]
      return (translate(currentSize, currentMeasure) / translate(fullSize, totalMeasure)) * 100
    }
    return 0
  }

  return (
    <Wrapper>
      {servers.map((server, i) =>
        <Instance key={i}>
          <SectionName>{i+1}</SectionName>
          <Section>
            <DiagramsContainer>
              <Item>
                <Title>Ram</Title>
                <CircularProgressbar
                  minValue={0}
                  maxValue={100}
                  styles={{ path: { stroke: '#ffb800' }, text: { fill: '#3a3541de' } }}
                  value={converterToGb(server.value.ram?.totalMemory, server.value.ram?.usedMemory)}
                  text={server.value.ram?.usedMemory}
                />
              </Item>
              <Item>
                <Title>Rom</Title>
                <CircularProgressbar
                  minValue={0}
                  maxValue={100}
                  styles={{ path: { stroke: '#2dca73' }, text: { fill: '#3a3541de' } }}
                  value={converterToGb(server.value.rom?.totalSpace, server.value.rom?.usedSpace)} 
                  text={server.value.rom?.usedSpace} 
                />
              </Item>
              <Item>
                <Title>CPU usage</Title>
                <CircularProgressbar
                  minValue={0}
                  maxValue={100}
                  styles={{ text: { fill: '#3a3541de' } }}
                  value={Math.floor(server.value.cpuUsage * 100) ?? 0} 
                  text={`${Math.floor(server.value.cpuUsage * 100)}%` ?? "0"} 
                />
              </Item>
            </DiagramsContainer>
            <TableContainer>
              <InfoTable statistic={server} />
            </TableContainer>
          </Section>
        </Instance>
      )}

    </Wrapper>)

};

export default Diagrams;