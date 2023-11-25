import React, {useContext} from 'react';
import {Col, Row} from 'reactstrap';
import classnames from 'classnames/bind';
import {DracorContext} from '../context';
import svgBibTex from '../images/bibtex.svg';
import svgRIS from '../images/ris.svg';
import svgCC0 from '../images/cc0.svg';
import style from './Footer.module.scss';

import pkg from '../../package.json';

const cx = classnames.bind(style);

const Footer = () => {
  const {apiInfo} = useContext(DracorContext);

  let apiVersionUrl = 'https://github.com/dracor-org/dracor-api/releases/';
  if (/^\d+\.\d+\.\d+(-(alpha|beta)(\.\d+)?)?$/.test(apiInfo.version)) {
    apiVersionUrl += `/tag/v${apiInfo.version}`;
  }

  let frontendVersionUrl =
    'https://github.com/dracor-org/dracor-frontend/releases/';
  if (/^\d+\.\d+\.\d+(-(alpha|beta)(\.\d+)?)?$/.test(pkg.version)) {
    frontendVersionUrl += `tag/v${pkg.version}`;
  }

  return (
    <Row className={cx('main')}>
      <Col className={cx('citation')}>
        <h5>
          If you want to cite DraCor, <wbr />
          please use the following reference:
        </h5>
        <a
          href={`${process.env.PUBLIC_URL}/cite_dracor.bib`}
          type="application/x-bibtex"
        >
          <img src={svgBibTex} alt="BibTeX" />
        </a>
        <a
          href={`${process.env.PUBLIC_URL}/cite_dracor.ris`}
          type="application/x-research-info-systems"
        >
          <img src={svgRIS} alt="RIS" />
        </a>
        <p>
          Fischer, Frank, et al. (2019). Programmable Corpora: Introducing
          DraCor, an Infrastructure for the Research on European Drama. In{' '}
          <em>Proceedings of DH2019: &quot;Complexities&quot;</em>, Utrecht
          University,{' '}
          <a
            href="https://doi.org/10.5281/zenodo.4284002"
            rel="noopener noreferrer"
            target="_blank"
          >
            doi:10.5281/zenodo.4284002
          </a>
          .
        </p>
      </Col>
      <Col className={cx('license')}>
        <h5>Drama Corpora Project</h5>
        <p>
          Unless otherwise stated, all corpora and the web design
          <br /> are released under Creative Commons{' '}
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0"
            rel="noopener noreferrer license"
            target="_blank"
          >
            0 1.0
          </a>
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0"
            rel="noopener noreferrer license"
            target="_blank"
          >
            <img src={svgCC0} alt="CC0" />
          </a>
        </p>
        {apiInfo.version && (
          <p className="api-info">
            This site runs the {''}
            <span className="version-pill">
              <span>DraCor Frontend</span>
              <a
                href={frontendVersionUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {pkg.version}
              </a>
            </span>
            {' on '}
            <span className="version-pill">
              <span>DraCor API</span>
              <a href={apiVersionUrl} target="_blank" rel="noopener noreferrer">
                {apiInfo.version}
              </a>
            </span>
            <wbr />
            {' using '}
            <span className="version-pill">
              <span>eXist-db</span>
              <a
                href={`https://github.com/eXist-db/exist/releases/tag/eXist-${apiInfo.existdb}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {apiInfo.existdb}
              </a>
            </span>
          </p>
        )}
      </Col>
    </Row>
  );
};

export default Footer;
