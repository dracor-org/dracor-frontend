import {Container} from 'reactstrap';
import {Helmet} from 'react-helmet';
import {Link, useLocation} from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';
import {apiUrl, legacyApiUrl, legacyDocPath} from '../config';
import Footer from './Footer';

import 'swagger-ui-react/swagger-ui.css';
import './APIDoc.scss';

const APIDoc = () => {
  const location = useLocation();

  if (location.pathname === legacyDocPath) {
    return (
      <Container fluid>
        <Helmet titleTemplate="%s - DraCor">
          <title>API Documentation v0 (legacy)</title>
        </Helmet>
        <p className="legacy-disclaimer">
          Note: This is the documentation for the legacy v0 API. The current API
          documentation is available <Link to="/doc/api">here</Link>.
        </p>
        {legacyApiUrl && (
          <SwaggerUI url={`${legacyApiUrl}/openapi.yaml`} deepLinking />
        )}
        {!legacyApiUrl && <p>Legacy API not available!</p>}
        <Footer />
      </Container>
    );
  }

  return (
    <Container fluid>
      <Helmet titleTemplate="%s - DraCor">
        <title>API Documentation</title>
      </Helmet>
      <SwaggerUI url={`${apiUrl}/openapi.yaml`} deepLinking />
      <Footer />
    </Container>
  );
};

export default APIDoc;
