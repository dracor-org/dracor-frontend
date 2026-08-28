import {Link} from '@tanstack/react-router';
import SwaggerUI from 'swagger-ui-react';
import {apiUrl, legacyApiUrl} from '../config';
import Footer from './Footer';

import 'swagger-ui-react/swagger-ui.css';
import './APIDoc.scss';

const APIDoc = ({mode = 'current'}) => {
  if (mode === 'legacy') {
    return (
      <div className="container-fluid">
        <title>API Documentation v0 (legacy) - DraCor</title>
        <p className="legacy-disclaimer">
          Note: This is the documentation for the legacy v0 API. The current API
          documentation is available <Link to="/doc/api">here</Link>.
        </p>
        {legacyApiUrl && (
          <SwaggerUI url={`${legacyApiUrl}/openapi.yaml`} deepLinking />
        )}
        {!legacyApiUrl && <p>Legacy API not available!</p>}
        <Footer />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <title>API Documentation - DraCor</title>
      <SwaggerUI url={`${apiUrl}/openapi.yaml`} deepLinking />
      <Footer />
    </div>
  );
};

export default APIDoc;
