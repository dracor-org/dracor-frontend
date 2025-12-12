import {Container} from 'reactstrap';
import {sitemapUrl} from '../config';
import Corpora from './Corpora';
import Header from './Header';
import Footer from './Footer';

const Home = () => {
  return (
    <>
      <Container fluid style={{zIndex: 1}}>
        <Header>DraCor - Open Infrastructure for Drama Analysis</Header>
      </Container>
      <Corpora />
      <Container fluid>
        <Footer withSitemap={!!sitemapUrl} />
      </Container>
    </>
  );
};

export default Home;
