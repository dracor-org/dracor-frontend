import React, {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {Dropdown, DropdownToggle, DropdownMenu} from 'reactstrap';

export interface NavItem {
  label: string;
  href: string;
  to: string;
}

interface Props {
  label: string;
  items: NavItem[];
}

const TopNavDropdown = ({label, items}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Dropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle nav caret>
        {label}
      </DropdownToggle>
      <DropdownMenu>
        {items.map((item) => {
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

export default TopNavDropdown;
