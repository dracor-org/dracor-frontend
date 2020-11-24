import React, {useContext} from 'react';
import {DracorContext} from '../context';

const Footer = () => {
  const {apiInfo} = useContext(DracorContext);

  return (
    <div className="footer">
      <div className="citation">
        <h6>
          If you want to cite DraCor, please use the following reference ({/**/}
          <a
            href={`${process.env.PUBLIC_URL}/cite_dracor.bib`}
            type="application/x-bibtex"
          >
            BibTeX
          </a>,
          {' '}
          <a
            href={`${process.env.PUBLIC_URL}/cite_dracor.ris`}
            type="application/x-research-info-systems"
          >
            RIS
          </a>):
        </h6>
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
      <div className="current-year">
        <p>Drama Corpora Project <br/>2020</p>
      </div>
      <div className="license">
        <a
          href="https://creativecommons.org/publicdomain/zero/1.0"
          rel="noopener noreferrer license"
          target="_blank"
        >
          <img src="img/cc0.svg" alt="CC0"/>
        </a>
        <br/>Unless otherwise stated, all corpora and the web design are released under
        {' '}
        <span className="version-pill">
          <span>Creative Commons</span>
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0"
            rel="noopener noreferrer license"
            target="_blank"
          >
            0 1.0
          </a>
        </span>
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
