import {useParams} from 'react-router-dom';
import PlayInfo from './Play';

export default function PlayPage() {
  const {corpusId, playId} = useParams();

  return (
    <div style={{height: '100%'}}>
      <PlayInfo corpusId={corpusId} playId={playId} />
    </div>
  );
}
