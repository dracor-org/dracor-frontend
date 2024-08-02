import React from 'react';
import PropTypes from 'prop-types';
import {Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames/bind';
import style from './PlayDetailsNav.module.scss';

const cx = classnames.bind(style);

const PlayDetailsNav = ({items, current}) => {
  return (
    <Nav tabs className={cx('main')}>
      {items.map((item) => (
        <NavItem key={item.name}>
          <NavLink
            href={`#${item.name}`}
            className={classnames({active: current === item.name})}
          >
            {item.label || item.name}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  );
};

PlayDetailsNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  current: PropTypes.string,
};

PlayDetailsNav.defaultProps = {
  current: null,
};

export default PlayDetailsNav;
