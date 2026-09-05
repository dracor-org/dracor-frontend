import {createFileRoute, Link, notFound} from '@tanstack/react-router';
import {ApiDoc} from '@dracor/react';
import {legacyApiUrl} from '../../config';
import Footer from '../../components/Footer';

export const Route = createFileRoute('/doc/legacy/api')({
  beforeLoad: () => {
    if (!legacyApiUrl) throw notFound();
  },
  component: LegacyApiDocRoute,
});

function LegacyApiDocRoute() {
  return (
    <div className="container-fluid">
      <title>API Documentation v0 (legacy) - DraCor</title>
      <p className="legacy-disclaimer">
        Note: This is the documentation for the legacy v0 API. The current API
        documentation is available <Link to="/doc/api">here</Link>.
      </p>
      <ApiDoc url={`${legacyApiUrl}/openapi.yaml`} title="DraCor API v0" />
      <Footer />
    </div>
  );
}
