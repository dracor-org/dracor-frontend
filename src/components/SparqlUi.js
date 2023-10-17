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
        <div id="yasgui" />
        <Footer />
      </div>
    </Container>
  );
}
