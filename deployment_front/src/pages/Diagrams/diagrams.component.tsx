import { FC } from 'react';

import 'react-circular-progressbar/dist/styles.css';
import DiagramItem from '../../Components/Diagram-Item';
import { Wrapper } from './diagrams.styles';
import { MiniBackState } from '../../utils/mini-back-state.enum';
import { useAppSelector } from '../../store/hooks';


const Diagrams: FC = () => {
  const miniBackCollection = useAppSelector(state => state.miniBack.miniBackCollection)

  return (
    <Wrapper>
      { miniBackCollection.filter(m => m.deployState === MiniBackState.DEPLOYED).length === 0 && <h1>No running servers</h1> }
      { miniBackCollection.filter(m => m.deployState === MiniBackState.DEPLOYED).map(miniback => (
        <DiagramItem key={miniback.id} miniback={miniback} />
      ))}
    </Wrapper>
  )
};

export default Diagrams;