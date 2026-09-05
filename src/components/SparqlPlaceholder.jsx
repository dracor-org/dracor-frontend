import Header from './Header';
import Footer from './Footer';

export default function SparqlPlaceholder() {
  return (
    <div className="container-fluid">
      <div className="dracor-page">
        <title>SPARQL - DraCor</title>
        <Header>SPARQL</Header>
        <p style={{margin: '4em 0', textAlign: 'center'}}>
          The RDF endpoints are currently being revised and will be published at
          a later date.
        </p>
        <Footer />
      </div>
    </div>
  );
}
