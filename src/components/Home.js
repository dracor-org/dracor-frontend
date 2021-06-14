import React from 'react';
import {Container} from 'reactstrap';
import Corpora from './Corpora';
import Footer from './Footer';

const Home = () => {
  return (
    <div className="row d-block">
      <Corpora/>
      <Container fluid>
        <Footer/>
      </Container>
    </div>
  );
};

export default Home;
