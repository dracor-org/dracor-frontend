import React from 'react';
import {Container} from 'reactstrap';
import Corpora from './Corpora';
import Footer from './Footer';

const Home = () => {
  return (
    <>
      <Corpora/>
      <Container fluid>
        <Footer/>
      </Container>
    </>
  );
};

export default Home;
