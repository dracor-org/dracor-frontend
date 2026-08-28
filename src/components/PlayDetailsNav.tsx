import {Link} from '@tanstack/react-router';
import classnames from 'classnames/bind';
import style from './PlayDetailsNav.module.scss';

const cx = classnames.bind(style);

interface Item {
  name: string;
  label: string;
}

interface Props {
  items: Item[];
  current?: string;
  corpusId: string;
  playId: string;
}

const PlayDetailsNav = ({items, current, corpusId, playId}: Props) => {
  return (
    <ul className={`nav nav-tabs ${cx('main')}`}>
      {items.map((item) => (
        <li className="nav-item" key={item.name}>
          <Link
            to="/$corpusId/$playId/$tab"
            params={{corpusId, playId, tab: item.name}}
            className={`nav-link ${current === item.name ? 'active' : ''}`}
          >
            {item.label || item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PlayDetailsNav;
