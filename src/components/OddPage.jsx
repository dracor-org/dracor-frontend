import {Container} from 'reactstrap';
import {Helmet} from 'react-helmet';
import Header from './Header';
import Footer from './Footer';
import Odd from './Odd';

const OddPage = () => {
  return (
    <Container fluid>
      <Helmet titleTemplate="%s - DraCor">
        <title>ODD</title>
      </Helmet>
      <div className="dracor-page">
        <Header>DraCor ODD</Header>
        <Odd />
        <Footer />
      </div>
    </Container>
  );
};

export default OddPage;
