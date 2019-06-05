import React from 'react';
import Metrics from './Metrics';

const Home = () => (
  <div>
    <Metrics/>
    <div className="logos">
      <img src="/img/hse.png" alt="Higher School of Economics"/>
      <img src="/img/uni-potsdam.svg" alt="Universität Potsdam"/>
    </div>
    <div style={{textAlign: 'center', maxWidth: '750px', margin: '1em auto'}}>
      <small>
        <em>
          {`Our two in-house TEI corpora (RusDraCor and GerDraCor) hosted on
            dracor.org are in public-alpha state. Feel free to use them, but
            there are some issues that still have to be resolved before the
            official release, which is planned for the second half of 2019. –
            SpanDraCor is based on our fork of the `
          }
          <a href="https://github.com/GHEDI/BETTE">
            BETTE corpus
          </a>
          {'. – ShakeDraCor was derived from the '}
          <a href="https://www.folgerdigitaltexts.org/">
            Shakespeare Folger Library
          </a>
          {'. – dracor.org is edited by '}
          <a href="https://www.hse.ru/en/org/persons/182492735">
            Frank&nbsp;Fischer
          </a>
          {' (Higher School of Economics, Moscow) and '}
          <a href="https://www.uni-potsdam.de/de/lit-19-jhd/peertrilcke.html">
            Peer&nbsp;Trilcke
          </a>
          {' (University of Potsdam).'}
        </em>
      </small>
    </div>
  </div>
);

export default Home;
