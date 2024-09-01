import {useState} from 'react';
import {NavLink as RouterNavLink} from 'react-router-dom';
import Headroom from 'react-headroom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames/bind';
import {
  ezlinavisUrl,
  legacyApiUrl,
  legacyDocPath,
  showPrizeBadge,
} from '../config';
import CorporaDropdown from './CorporaDropdown';
import TopNavDropdown from './TopNavDropdown';
import style from './TopNav.module.scss';
import svgTEI from '../images/TEI-Logo.svg';

const cx = classnames.bind(style);

const TopNav = () => {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => setNavOpen(!navOpen);

  return (
    <Headroom disableInlineStyles enable="true" upTolerance={50} pinStart={250}>
      <Navbar expand="md" className={cx('base')}>
        <NavbarBrand title="Drama Corpora Project (DraCor)" href="/" />
        <NavbarToggler onClick={toggleNav} />
        <Collapse navbar isOpen={navOpen}>
          <Nav navbar tag="div" className={cx('main')}>
            <TopNavDropdown
              label="About"
              items={[
                {label: 'What is DraCor?', to: '/doc/what-is-dracor'},
                {label: 'FAQ', to: '/doc/faq'},
                {label: 'Credits', to: '/doc/credits'},
                {label: 'Media Kit', to: '/doc/media-kit'},
                {label: 'Imprint', to: '/doc/imprint-and-gdpr'},
              ]}
            />
            <CorporaDropdown />
            <TopNavDropdown
              label="Tools"
              items={[
                {label: 'API', to: '/doc/api'},
                legacyApiUrl
                  ? {label: 'API v0 (legacy)', to: legacyDocPath}
                  : null,
                {label: 'ODD', to: '/doc/odd'},
                {label: 'SPARQL', to: '/sparql'},
                {label: 'ezlinavis', href: ezlinavisUrl},
                {
                  label: 'pydracor',
                  href: 'https://pypi.org/project/pydracor/',
                },
                {
                  label: 'rdracor',
                  href: 'https://github.com/dracor-org/rdracor',
                },
                {label: 'Shiny DraCor', href: 'https://shiny.dracor.org/'},
              ].filter((item) => item)}
            />
            <TopNavDropdown
              label="How To"
              items={[
                {label: 'Tutorials', to: '/doc/tutorials'},
                {label: 'Research', to: '/doc/research'},
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
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </NavLink>
            </NavItem>
          </Nav>
          {showPrizeBadge && (
            <Nav navbar className={cx('prize')}>
              <NavItem>
                <NavLink
                  href="https://tei-c.org/activities/rahtz-prize-for-tei-ingenuity/"
                  title="Rahtz Prize for TEI Ingenuity 2022"
                >
                  <span className={cx('prize-name')}>Rahtz Prize</span>
                  <span className={cx('prize-year')}>2022</span>
                  <img alt="TEI Logo" src={svgTEI}></img>
                </NavLink>
              </NavItem>
            </Nav>
          )}
        </Collapse>
      </Navbar>
    </Headroom>
  );
};

export default TopNav;
