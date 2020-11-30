import React, {useContext} from 'react';
import {DracorContext} from '../context';

const Footer = () => {
  const {apiInfo} = useContext(DracorContext);

  return (
    <div className="footer">
      <div className="citation">
        <h5>
          If you want to cite DraCor, <wbr/>please use the following reference:
        </h5>
        <a
          href={`${process.env.PUBLIC_URL}/cite_dracor.bib`}
          type="application/x-bibtex"
        >
          <img src="../img/bib-icon.svg" alt="BibTex"/>
        </a>
        <a
          href={`${process.env.PUBLIC_URL}/cite_dracor.ris`}
          type="application/x-research-info-systems"
        >
          <img src="../img/ris-icon.svg" alt="RIS"/>
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
          </a>.
        </p>
      </div>
      <div className="license">
        <h5>Drama Corpora Project 2020</h5>
        <p>Unless otherwise stated, all corpora and the web design<br/> are released under Creative Commons
          {' '}
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
            <img src="../img/cc0.svg" alt="CC0"/>
          </a>
        </p>
        {apiInfo.version && (
          <p className="api-info">
            This site runs on
            {' '}
            <span className="version-pill">
              <span>DraCor API</span>
              <a
                href={`https://github.com/dracor-org/dracor-api/releases/tag/v${apiInfo.version}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {apiInfo.version}
              </a>
            </span>
            <wbr/>
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
      </div>
    </div>
  );
};

export default Footer;
