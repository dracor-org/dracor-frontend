import {ReactElement} from 'react';
import style from './PlayDetailsTab.module.css';

interface Props {
  children: ReactElement | ReactElement[];
  characters: ReactElement;
  description: ReactElement;
  metrics: ReactElement;
  segments: ReactElement;
}

const PlayDetailsTab = ({
  children,
  description,
  characters,
  metrics,
  segments,
}: Props) => {
  return (
    <div className={style.main}>
      <div className={style.content}>{children}</div>
      <div className={style.description}>{description}</div>
      {metrics && <div className={style.metrics}>{metrics}</div>}
      {characters && <div className={style.characters}>{characters}</div>}
      {segments && <div className={style.segments}>{segments}</div>}
    </div>
  );
};

export default PlayDetailsTab;
