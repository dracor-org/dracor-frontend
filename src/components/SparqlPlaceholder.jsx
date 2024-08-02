import {Container} from 'reactstrap';
import {Helmet} from 'react-helmet';
import Header from './Header';
import Footer from './Footer';

export default function SparqlPlaceholder() {
  return (
    <Container fluid>
      <div className="dracor-page">
        <Helmet titleTemplate="%s - DraCor">
          <title>SPARQL</title>
        </Helmet>
        <Header>SPARQL</Header>
        <p style={{margin: '4em 0', textAlign: 'center'}}>
          The RDF endpoints are currently being revised and will be published at
          a later date.
        </p>
        <Footer />
      </div>
    </Container>
  );
}
