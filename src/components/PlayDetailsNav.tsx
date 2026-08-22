import {Link} from '@tanstack/react-router';
import {Nav, NavItem} from 'reactstrap';
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
    <Nav tabs className={cx('main')}>
      {items.map((item) => (
        <NavItem key={item.name}>
          <Link
            to="/$corpusId/$playId/$tab"
            params={{corpusId, playId, tab: item.name}}
            className={cx('nav-link', {active: current === item.name})}
          >
            {item.label || item.name}
          </Link>
        </NavItem>
      ))}
    </Nav>
  );
};

export default PlayDetailsNav;
