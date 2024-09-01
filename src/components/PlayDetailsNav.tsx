import {Nav, NavItem, NavLink} from 'reactstrap';
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
}

const PlayDetailsNav = ({items, current}: Props) => {
  return (
    <Nav tabs className={cx('main')}>
      {items.map((item) => (
        <NavItem key={item.name}>
          <NavLink
            href={`#${item.name}`}
            className={cx({active: current === item.name})}
          >
            {item.label || item.name}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  );
};

export default PlayDetailsNav;
