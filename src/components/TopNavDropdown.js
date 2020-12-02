import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap';

const TopNavDropdown = ({label, items}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Dropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle nav caret>{label}</DropdownToggle>
      <DropdownMenu>
        {items.map(item => {
          if (item.href) {
            return (
              <a
                key={item.label}
                href={item.href}
                className="dropdown-item"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className="dropdown-item"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

TopNavDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      href: PropTypes.string,
      to: PropTypes.string
    })
  ).isRequired
};

export default TopNavDropdown;
