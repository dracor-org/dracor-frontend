import React, {useState} from 'react';
import {NavLink as RouterNavLink} from 'react-router-dom';
import Headroom from 'react-headroom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames/bind';
import {ezlinavisUrl} from '../config';
import CorporaDropdown from './CorporaDropdown';
import TopNavDropdown from './TopNavDropdown';
import style from './TopNav.module.scss';

const cx = classnames.bind(style);

const TopNav = () => {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => setNavOpen(!navOpen);

  return (
    <Headroom upTolerance={20}>
      <Navbar expand="md" className={cx('base')}>
        <NavbarBrand title="Drama Corpora Project (DraCor)" href="/"/>
        <NavbarToggler onClick={toggleNav}/>
        <Collapse navbar isOpen={navOpen}>
          <Nav navbar tag="div" className={cx('main')}>
            <TopNavDropdown
              label="About" items={[
                {label: 'What is DraCor?', to: '/doc/what-is-dracor'},
                {label: 'Credits', to: '/doc/credits'},
                {label: 'Imprint', to: '/doc/imprint-and-gdpr'}
              ]}
            />
            <CorporaDropdown/>
            <TopNavDropdown
              label="Tools" items={[
                {label: 'API', to: '/doc/api'},
                {label: 'SPARQL', to: '/sparql'},
                {label: 'ezlinavis', href: ezlinavisUrl},
                {label: 'Shiny DraCor', href: 'https://shiny.dracor.org/'}
              ]}
            />
            <TopNavDropdown
              label="How To" items={[
                {label: 'Tutorials', to: '/doc/tutorials'},
                {label: 'Research', to: '/doc/research'}
              ]}
            />
            <NavItem tag="div">
              <RouterNavLink to="/doc/merch" className="nav-link">
                Merch
              </RouterNavLink>
            </NavItem>
          </Nav>
          <Nav navbar className={cx('github')}>
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
