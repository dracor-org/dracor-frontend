import React from 'react';
import {Container} from 'reactstrap';
import Corpora from './Corpora';
import Footer from './Footer';

const Home = () => {
  return (
    <Container fluid>
      <div className="row d-block">
        <Corpora/>
      </div>
      <Footer/>
    </Container>
  );
};

export default Home;
