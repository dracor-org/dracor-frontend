import React, {useState} from 'react';
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
  NavLink
} from 'reactstrap';
import Headroom from 'react-headroom';
import {ezlinavisUrl} from '../config';
import CorporaDropdown from './CorporaDropdown';

const TopNav = () => {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => setNavOpen(!navOpen);

  return (
    <Headroom disableInlineStyles upTolerance={50}>
      <Navbar expand="md">
        <NavbarBrand title="Drama Corpora Project (DraCor)" href="/"/>
        <NavbarToggler onClick={toggleNav}/>
        <Collapse navbar isOpen={navOpen}>
          <Nav navbar>
            <NavItem>
              <RouterNavLink to="/" className="nav-link">
                Home
              </RouterNavLink>
            </NavItem>
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
            <NavItem>
              <NavLink
                href={ezlinavisUrl}
                title="Simple Network Visualization for Literary Texts"
              >
                Easy Linavis
              </NavLink>
            </NavItem>
            <NavItem>
              <RouterNavLink
                to="/about"
                className="nav-link"
                title="About the Drama Corpora Project"
              >
                About
              </RouterNavLink>
            </NavItem>
          </Nav>
          <Nav navbar className="git-icon">
            <NavItem>
              <NavLink
                href="https://github.com/dracor-org"
                title="DraCor GitHub"
              >
                <span>DraCor GitHub</span>
                <FontAwesomeIcon icon={faGithub} size="lg"/>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </Headroom>
  );
};

export default TopNav;
