import React, {useContext, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import {DracorContext} from '../context';

const CorporaDropdown = () => {
  const {corpora} = useContext(DracorContext);
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  const toggle = () => setIsOpen(!isOpen);

  const items = corpora.map(c => {
    const path = `/${c.name}`;
    return (
      <DropdownItem key={c.name} onClick={() => history.push(path)}>
        {c.title}
      </DropdownItem>
    );
  });

  return (
    <Dropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle nav caret>
        Corpora
      </DropdownToggle>
      <DropdownMenu>
        {items}
      </DropdownMenu>
    </Dropdown>
  );
};

export default CorporaDropdown;
