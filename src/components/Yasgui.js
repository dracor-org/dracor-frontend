import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import yasgui from 'yasgui/dist/yasgui';

import 'yasgui/dist/yasgui.min.css';

yasgui.defaults.catalogueEndpoints = [
  {endpoint: 'https://dracor.org/api/sparql', title: 'Dracor'},
  {endpoint: 'https://query.wikidata.org/sparql', title: 'Wikidata'}
];

class Yasgui extends Component {
  componentDidMount () {
    yasgui(document.getElementById('yasgui'), {
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
