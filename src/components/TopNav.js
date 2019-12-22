import React, {Component} from 'react';
import {Route, NavLink as RouterNavLink} from 'react-router-dom';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
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
import {DracorContext} from '../context';
import {ezlinavisUrl} from '../config';

class CorporaDropdown extends Component {
  static contextType = DracorContext;

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
    const {corpora} = this.context;

    const items = corpora.map(c => {
      const path = `/${c.name}`;
      return (
        <DropdownItem key={c.name} onClick={() => history.push(path)}>
          {c.title}
        </DropdownItem>
      );
    });

    return (
      <Dropdown isOpen={isOpen} toggle={this.toggle}>
        <DropdownToggle nav caret>
          Corpora
        </DropdownToggle>
        <DropdownMenu>
          {items}
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
      <Navbar light color="light" expand="md" className="mb-4">
        <NavbarBrand href="/">Drama Corpora Project (DraCor)</NavbarBrand>
        <NavbarToggler onClick={this.toggle}/>
        <Collapse navbar isOpen={isOpen}>
          <Nav navbar className="mr-auto">
            <Route path="/" component={CorporaDropdown}/>
            <NavItem>
              <RouterNavLink to="/sparql" className="nav-link">
                SPARQL
              </RouterNavLink>
            </NavItem>
            <NavItem>
              <RouterNavLink to="/documentation/api" className="nav-link">
                API
              </RouterNavLink>
            </NavItem>
          </Nav>
          <Nav navbar className="ml-auto">
            <NavItem>
              <NavLink
                href={ezlinavisUrl}
                title="Simple Network Visualization for Literary Texts"
              >
                Easy Linavis
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="https://github.com/dracor-org"
                title="DraCor GitHub"
              >
                <FontAwesomeIcon icon={faGithub} size="lg"/>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
