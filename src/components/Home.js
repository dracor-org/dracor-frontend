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
          <a target="_blank" rel="noopener noreferrer license" href="https://creativecommons.org/publicdomain/zero/1.0">
          <img src="img/cc.svg" /><img src="img/cc0.svg" />
          </a>
          <br/>Unless otherwise stated, all corpora and the web design are released under <span>Creative&nbsp;Commons</span>
          <a className="version" target="_blank" rel="noopener noreferrer license" href="https://creativecommons.org/publicdomain/zero/1.0">
            0&nbsp;1.0
          </a>
          {apiInfo.version && (
        <p className="running">
          This site runs on <span>DraCor&nbsp;API</span>
          <a className="version" target="_blank" rel="noopener noreferrer" href={`https://github.com/dracor-org/dracor-api/releases/tag/v${apiInfo.version}`}>
            {apiInfo.version}
          </a>
          {' '}
          using&nbsp;<span>eXist&#8209;db</span>
          <a className="version" target="_blank" rel="noopener noreferrer" href={`https://github.com/eXist-db/exist/releases/tag/eXist-${apiInfo.existdb}`}>
            {apiInfo.existdb}
          </a>
        </p>
        )}
        </div>

      </div>
    </div>
  );
};

export default Home;
