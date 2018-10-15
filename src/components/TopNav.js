import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

class CorporaDropdown extends Component {
  constructor (props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle () {
    this.setState(prevState => ({isOpen: !prevState.isOpen}));
  }

  render () {
    const {isOpen} = this.state;
    const {history} = this.props;
    return (
      <Dropdown isOpen={isOpen} toggle={this.toggle}>
        <DropdownToggle nav caret>
          Corpora
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => history.push('/ger')}>
            German Drama Corpus
          </DropdownItem>
          <DropdownItem onClick={() => history.push('/rus')}>
            Russian Drama Corpus
          </DropdownItem>
          <DropdownItem onClick={() => history.push('/shake')}>
            Shakespeare Drama Corpus
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default class TopNav extends Component {
  constructor (props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle () {
    this.setState(prevState => ({isOpen: !prevState.isOpen}));
  }

  // allow us to use 'toggle'
  /* eslint "react/jsx-handler-names": 0 */

  render () {
    const {isOpen} = this.state;
    return (
      <Navbar color="light" light expand="md" className="mb-4">
        <NavbarBrand href="/">Drama Corpora Project (DraCor)</NavbarBrand>
        <NavbarToggler onClick={this.toggle}/>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <Route path="/" component={CorporaDropdown}/>
            <NavItem>
              <NavLink
                href="https://dracor.org/documentation/api/"
                target="dracor-swagger"
              >
                API
              </NavLink>
            </NavItem>
          </Nav>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="https://ezlinavis.dracor.org/">
                Easy Linavis
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
