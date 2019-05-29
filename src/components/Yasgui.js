import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import yasgui from 'yasgui/dist/yasgui';

import 'yasgui/dist/yasgui.min.css';

yasgui.defaults.catalogueEndpoints = [
  {endpoint: 'https://dracor.org/api/sparql', title: 'Dracor'},
  {endpoint: 'https://query.wikidata.org/sparql', title: 'Wikidata'}
];

yasgui.YASQE.defaults.value = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dracon: <http://dracor.org/ontology#>
SELECT * WHERE {
  ?sub ?pred ?obj .
}
LIMIT 10`;

class Yasgui extends Component {
  componentDidMount () {
    yasgui(document.querySelector('#yasgui'), {
      api: {
        urlShortener: 'https://dracor.org/shorten'
      },
      yasqe: {
        sparql: {
          endpoint: 'https://dracor.org/api/sparql',
          acceptHeaderSelect: 'application/sparql-results+xml',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      }
    });
  }

  render () {
    return (
      <div>
        <Helmet titleTemplate="%s - DraCor">
          <title>SPARQL</title>
        </Helmet>
        <div id="yasgui"/>
      </div>
    );
  }
}

export default Yasgui;
