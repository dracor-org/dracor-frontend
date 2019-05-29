import React, {Component} from 'react';
import {Route, NavLink as RouterNavLink} from 'react-router-dom';
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
import config from '../config';

const {apiUrl} = config;

class CorporaDropdown extends Component {
  constructor (props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      corpora: [],
      isOpen: false
    };
  }

  componentWillMount () {
    this.load();
  }

  load () {
    const url = `${apiUrl}/corpora`;
    fetch(url, {})
      .then(response => {
        return response.json();
      })
      .then(corpora => {
        console.log(corpora);
        this.setState({corpora});
      })
      .catch(error => {
        console.log('parsing failed', error);
      });
  }

  toggle () {
    this.setState(prevState => ({isOpen: !prevState.isOpen}));
  }

  render () {
    const {isOpen, corpora} = this.state;
    const {history} = this.props;

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
