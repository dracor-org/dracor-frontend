import React from 'react';
import PropTypes from 'prop-types';
import {Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';

const PlayNav = ({items, current}) => {
  return (
    <Nav tabs className="dracor-play-nav">
      {items.map(item => (
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

PlayNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.required,
      label: PropTypes.string.required
    })
  ).isRequired,
  current: PropTypes.string
};

PlayNav.defaultProps = {
  current: null
};

export default PlayNav;
