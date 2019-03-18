import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import SwaggerUI from 'swagger-ui-react';

import 'swagger-ui-react/swagger-ui.css';
import './APIDoc.css';

class APIDoc extends Component {
  render () {
    return (
      <div>
        <Helmet titleTemplate="%s - DraCor">
          <title>API Documentation</title>
        </Helmet>
        <SwaggerUI url="/api.yaml"/>
      </div>
    );
  }
}

export default APIDoc;
