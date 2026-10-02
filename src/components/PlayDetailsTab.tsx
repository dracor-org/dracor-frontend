import type {ReactNode} from 'react';
import style from './PlayDetailsTab.module.css';

interface Props {
  children: ReactNode;
  characters: ReactNode;
  description: ReactNode;
  metrics: ReactNode;
  segments: ReactNode;
}

export default function PlayDetailsTab({
  children,
  description,
  characters,
  metrics,
  segments,
}: Props) {
  return (
    <div className={style.main}>
      <div className={style.content}>{children}</div>
      <div className={style.description}>{description}</div>
      {metrics && <div className={style.metrics}>{metrics}</div>}
      {characters && <div className={style.characters}>{characters}</div>}
      {segments && <div className={style.segments}>{segments}</div>}
    </div>
  );
}
