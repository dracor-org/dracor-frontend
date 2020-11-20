import React, {useState} from 'react';
import {NavLink as RouterNavLink} from 'react-router-dom';
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
import TopNavDropdown from './TopNavDropdown';

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
            <TopNavDropdown label="About" items={[
              {label: 'What is DraCor?', to: '/doc/what-is-dracor'},
              {label: 'Credits', to: '/doc/credits'},
              {label: 'Imprint', to: '/doc/imprint-and-gdpr'}
            ]}/>
            <CorporaDropdown/>
            <TopNavDropdown label="Tools" items={[
              {label: 'API', to: '/documentation/api'},
              {label: 'SPARQL', to: '/sparql'},
              {label: 'ezlinavis', href: ezlinavisUrl},
              {label: 'Shiny DraCor', href: 'https://shiny.dracor.org/'}
            ]}/>
            <TopNavDropdown label="How To" items={[
              {label: 'Tutorials', to: '/doc/tutorials'},
              {label: 'Research', to: '/doc/research'}
            ]}/>
            <NavItem>
              <RouterNavLink to="/doc/merch" className="nav-link">
                Merch
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
