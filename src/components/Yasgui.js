import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import yasgui from 'yasgui/dist/yasgui';
import {sparqlUrl, shortenerUrl as urlShortener} from '../config';

import 'yasgui/dist/yasgui.min.css';

const endpoint = sparqlUrl;

yasgui.defaults.catalogueEndpoints = [
  {endpoint, title: 'DraCor'},
  {endpoint: 'https://query.wikidata.org/sparql', title: 'Wikidata'}
];

yasgui.YASQE.defaults.value = `PREFIX urn: <http://fliqz.com/>
SELECT *  FROM <urn:x-arq:UnionGraph> WHERE {
  ?sub ?pred ?obj .
}
LIMIT 50`;

class Yasgui extends Component {
  componentDidMount () {
    yasgui(document.querySelector('#yasgui'), {
      api: {
        urlShortener
      },
      yasqe: {
        sparql: {
          endpoint,
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
        <div className="h-header"><h2>SPARQL</h2></div>
        <div id="yasgui"/>
      </div>
    );
  }
}

export default Yasgui;
