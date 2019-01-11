import React, {Component} from 'react';
import yasgui from 'yasgui/dist/yasgui';

import 'yasgui/dist/yasgui.min.css';

class Yasgui extends Component {
  componentDidMount () {
    console.log(yasgui);
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
    return <div id="yasgui"/>;
  }
}

export default Yasgui;
