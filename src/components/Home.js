import React, {useContext} from 'react';
import {DracorContext} from '../context';
import Metrics from './Metrics';
import '../slick-theme.css';
import '../slick.css';

const Home = () => {
  const {apiInfo} = useContext(DracorContext);

  return (
    <div>
      <Metrics/>
      <div className="footer">
        <div className="citation">
          <h6>To cite DraCor, please use:</h6>
          <p>
            Frank Fischer et al.:
            {' '}
            <a target="_blank" rel="noopener noreferrer" href="https://dev.clariah.nl/files/dh2019/boa/0268.html">
              Programmable Corpora: Introducing DraCor, an Infrastructure for the
              Research on European Drama.
            </a>
            <br/>In <i>Proceedings of DH2019</i>, Utrecht University.
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
            <span>CreativeCommons</span>
            <a
              href="https://creativecommons.org/publicdomain/zero/1.0"
              rel="noopener noreferrer license"
              target="_blank"
            >
              0&nbsp;1.0
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
    </div>
  );
};

export default Home;
