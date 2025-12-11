import {Container} from 'reactstrap';
import {sitemapUrl} from '../config';
import Corpora from './Corpora';
import Footer from './Footer';

const Home = () => {
  return (
    <>
      <Corpora />
      <Container fluid>
        <Footer withSitemap={!!sitemapUrl} />
      </Container>
    </>
  );
};

export default Home;
