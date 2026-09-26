import {useEffect} from 'react';
import Yasgui from '@zazuko/yasgui';
import {sparqlUrl} from '../config';
import Header from './Header';
import Footer from './Footer';

import '@zazuko/yasgui/build/yasgui.min.css';
import './SparqlUi.css';

const endpoint = sparqlUrl;

Yasgui.Yasqe.defaults.value = `PREFIX urn: <http://fliqz.com/>
SELECT *  FROM <urn:x-arq:UnionGraph> WHERE {
  ?sub ?pred ?obj .
}
LIMIT 50`;

export default function SparqlUi() {
  useEffect(() => {
    const container = document.getElementById('yasgui');
    if (!container) return;
    const yasgui = new Yasgui(container, {
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
  }, []);

  return (
    <div className="dracor-page">
      <title>SPARQL - DraCor</title>
      <Header>SPARQL</Header>
      <p style={{margin: '2em 0 1em', textAlign: 'center'}}>
        <em>
          The RDF implementation is still experimental. A stable version will be
          released at a later date.
        </em>
      </p>
      <div id="yasgui" />
      <Footer />
    </div>
  );
}
