import React from 'react';
import Metrics from './Metrics';
import '../slick-theme.css';
import '../slick.css';

const Home = () => (
  <div>
    <Metrics/>
    <div className="footer">
      <div className="citation">
        <h6>To cite DraCor, please use:</h6>
        <p>
          Frank Fischer et al.:
          {' '}
          <a href="https://dev.clariah.nl/files/dh2019/boa/0268.html">
            Programmable Corpora: Introducing DraCor, an Infrastructure for the
            Research on European Drama.
          </a>
          <br/>In <i>Proceedings of DH2019</i>, Utrecht University.
        </p>
      </div>
      <div className="current-year">
        <h6>&nbsp;</h6>
        <p>Drama Corpora Project <br/>2020</p>
      </div>
      <div className="license">
        <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
          <img alt="Creative Commons License" src="/img/by.svg"/>
        </a>
        <br/>This work is licensed under a
        {' '}
        <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
          Creative Commons Attribution 4.0 International License
        </a>.
      </div>
    </div>
  </div>
);

export default Home;
