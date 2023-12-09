import {Container} from 'reactstrap';
import Header from './Header';
import Footer from './Footer';
import Odd from './Odd';

const OddPage = () => {
  return (
    <Container fluid>
      <div className="dracor-page">
        <Header>DraCor ODD</Header>
        <Odd />
        <Footer />
      </div>
    </Container>
  );
};

export default OddPage;
