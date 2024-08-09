import {ReactElement} from 'react';
import classnames from 'classnames/bind';
import style from './PlayDetailsTab.module.scss';

const cx = classnames.bind(style);

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
    <div className={cx('main')}>
      <div className={cx('content')}>{children}</div>
      <div className={cx('description')}>{description}</div>
      {metrics && <div className={cx('metrics')}>{metrics}</div>}
      {characters && <div className={cx('characters')}>{characters}</div>}
      {segments && <div className={cx('segments')}>{segments}</div>}
    </div>
  );
};

export default PlayDetailsTab;
