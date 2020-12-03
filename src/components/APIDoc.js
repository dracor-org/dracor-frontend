import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import SwaggerUI from 'swagger-ui-react';
import Footer from './Footer';

import 'swagger-ui-react/swagger-ui.css';
import './APIDoc.scss';

class APIDoc extends Component {
  render () {
    return (
      <div>
        <Helmet titleTemplate="%s - DraCor">
          <title>API Documentation</title>
        </Helmet>
        <SwaggerUI url="/api.yaml"/>
        <Footer/>
      </div>
    );
  }
}

export default APIDoc;
