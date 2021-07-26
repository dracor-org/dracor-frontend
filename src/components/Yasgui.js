import React, {Component} from 'react';
import {Container} from 'reactstrap';
import {Helmet} from 'react-helmet';
import yasgui from 'yasgui/dist/yasgui';
import {sparqlUrl, shortenerUrl as urlShortener} from '../config';
import Header from './Header';
import Footer from './Footer';

import 'yasgui/dist/yasgui.min.css';
import './Yasgui.scss';

const endpoint = sparqlUrl;

yasgui.defaults.catalogueEndpoints = [
  {endpoint, title: 'DraCor'},
  {endpoint: 'https://query.wikidata.org/sparql', title: 'Wikidata'},
];

yasgui.YASQE.defaults.value = `PREFIX urn: <http://fliqz.com/>
SELECT *  FROM <urn:x-arq:UnionGraph> WHERE {
  ?sub ?pred ?obj .
}
LIMIT 50`;

class Yasgui extends Component {
  componentDidMount() {
    yasgui(document.querySelector('#yasgui'), {
      api: {
        urlShortener,
      },
      yasqe: {
        sparql: {
          endpoint,
          acceptHeaderSelect: 'application/sparql-results+xml',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      },
    });
  }

  render() {
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
}

export default Yasgui;
