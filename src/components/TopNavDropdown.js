import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

const TopNavDropdown = ({label, items}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Dropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle nav caret>{label}</DropdownToggle>
      <DropdownMenu>
        {items.map(item => (
          <DropdownItem key={item.label}>
            {item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <NavLink to={item.to}>{item.label}</NavLink>
            )}
          </DropdownItem>
        ))}
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
