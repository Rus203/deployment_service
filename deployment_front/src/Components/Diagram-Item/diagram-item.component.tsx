import { FC, useEffect, useState } from 'react';
import { IMiniBack } from '../../interface/miniback.interface';

import { CircularProgressbar } from 'react-circular-progressbar';
import InfoTable from '../InfoTable/info-table.component';
import { Instance, SectionName, Section, DiagramsContainer, Item, Title, TableContainer, SpinBlock } from './diagram-item.styles';
import { getByPattern } from '../../utils/getByPattern';
import io from 'socket.io-client'
import { MiniBackState } from '../../utils/mini-back-state.enum';
import { IStatistic } from '../../interface/statictic.interface';
import { capitalizeFirstLowercaseRest } from '../../utils/upper-first-letter';
import Spinner from '../Spinner';

interface IProps {
  miniback: IMiniBack;
}

const getPercentToBar = (total: string, current: string): number => {
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
    const [currentSize, currentMeasure] = [getByPattern(current, /[0-9.]+/g), getByPattern(current, /[a-zA-Z]/g)]
    return (translate(currentSize, currentMeasure) / translate(fullSize, totalMeasure)) * 100
  }
  return (getByPattern(total, /[0-9.]+/g) / getByPattern(current, /[0-9.]+/g)) * 100
}

const DiagramItem: FC<IProps> = ({ miniback }) => {
  const [servers, setServers] = useState<IStatistic>()

  useEffect(() => {
    const { port, serverUrl } = miniback
    if (miniback.deployState === MiniBackState.DEPLOYED) {
      const socket = io(`http://${serverUrl}:${port}`)

      socket.on('message', data => {
        setServers(data)
      })

      return () => { socket.disconnect() }
    }
  }, [miniback])

  return !servers ? <SpinBlock><Spinner /></SpinBlock> : (
    <Instance>
      <SectionName>{capitalizeFirstLowercaseRest(miniback.name)}</SectionName>
      <Section>
        <DiagramsContainer>
          <Item>
            <Title>Ram</Title>
            <CircularProgressbar
              minValue={0}
              maxValue={100}
              styles={{ path: { stroke: '#ffb800' }, text: { fill: '#3a3541de' } }}
              value={getPercentToBar(servers.ram?.totalMemory, servers.ram?.usedMemory)}
              text={servers.ram?.usedMemory}
            />
          </Item>
          <Item>
            <Title>Rom</Title>
            <CircularProgressbar
              minValue={0}
              maxValue={100}
              styles={{ path: { stroke: '#2dca73' }, text: { fill: '#3a3541de' } }}
              value={getPercentToBar(servers.rom?.totalSpace, servers.rom?.usedSpace)}
              text={servers.rom?.usedSpace}
            />
          </Item>
          <Item>
            <Title>CPU usage</Title>
            <CircularProgressbar
              minValue={0}
              maxValue={100}
              styles={{ text: { fill: '#3a3541de' } }}
              value={+((servers.cpu * 100).toFixed(2))}
              text={`${+((servers.cpu * 100).toFixed(2))}%`}
            />
          </Item>
        </DiagramsContainer>
        <TableContainer>
          <InfoTable statistic={servers} />
        </TableContainer>
      </Section>
    </Instance>
  );
};

export default DiagramItem;