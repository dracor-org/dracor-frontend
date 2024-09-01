import {useEffect} from 'react';
import {Container} from 'reactstrap';
import {Helmet} from 'react-helmet';
import Yasgui from '@triply/yasgui';
import {sparqlUrl} from '../config';
import Header from './Header';
import Footer from './Footer';

import '@triply/yasgui/build/yasgui.min.css';
import './SparqlUi.scss';

const endpoint = sparqlUrl;

Yasgui.Yasqe.defaults.value = `PREFIX urn: <http://fliqz.com/>
SELECT *  FROM <urn:x-arq:UnionGraph> WHERE {
  ?sub ?pred ?obj .
}
LIMIT 50`;

export default function SparqlUi() {
  useEffect(() => {
    const yasgui = new Yasgui(document.getElementById('yasgui'), {
      requestConfig: {endpoint},
      copyEndpointOnNewTab: false,
      endpointCatalogueOptions: {
        getData: () => [
          {endpoint},
          {endpoint: 'https://query.wikidata.org/sparql'},
        ],
      },
    });
    // eslint-disable-next-line no-console
    console.log(yasgui);
    return () => {};
  }, []);

  return (
    <Container fluid>
      <div className="dracor-page">
        <Helmet titleTemplate="%s - DraCor">
          <title>SPARQL</title>
        </Helmet>
        <Header>SPARQL</Header>
        <p style={{margin: '2em 0 1em', textAlign: 'center'}}>
          <em>
            The RDF implementation is still experimental. A stable version will
            be released at a later date.
          </em>
        </p>
        <div id="yasgui" />
        <Footer />
      </div>
    </Container>
  );
}
