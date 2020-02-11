import React from 'react';
import Metrics from './Metrics';
import '../slick-theme.css';
import '../slick.css';

const Home = () => (
  <div>
    <Metrics/>
    <div className="logo-left">
      <img src="/img/hse.svg" alt="Higher School of Economics"/>
    </div>
    <div className="logo-right">
      <img src="/img/uni-potsdam.svg" alt="Universität Potsdam"/>
    </div>
  </div>
);

export default Home;
