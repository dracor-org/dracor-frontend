import {Container} from 'reactstrap';
import Corpora from './Corpora';
import Footer from './Footer';

const Home = () => {
  return (
    <>
      <Corpora />
      <Container fluid>
        <Footer withSitemap />
      </Container>
    </>
  );
};

export default Home;
