import { FC } from 'react';

import 'react-circular-progressbar/dist/styles.css';
import DiagramItem from '../../Components/Diagram-Item';
import { useGetMinibacksQuery } from '../../services';
import {
  Wrapper
} from './diagrams.styles';
import { MiniBackState } from '../../utils/mini-back-state.enum';


const Diagrams: FC = () => {
  const { data: minibacks } = useGetMinibacksQuery(undefined)


  return (
    <Wrapper>
      {minibacks?.filter(m => m.deployState === MiniBackState.DEPLOYED).length === 0 && <h1>No running servers</h1> }
      {minibacks !== undefined && minibacks?.filter(m => m.deployState === MiniBackState.DEPLOYED).map(miniback => (
        <DiagramItem key={miniback.id} miniback={miniback} />
      ))}
    </Wrapper>
  )
};

export default Diagrams;