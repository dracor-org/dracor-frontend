import {createFileRoute, Link, notFound} from '@tanstack/react-router';
import {ApiDoc} from '@dracor/react';
import {legacyApiUrl} from '../../config';
import Header from '../../components/Header';
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
      <Header>DraCor API v0</Header>
      <p className="legacy-disclaimer">
        Note: This is the documentation for the legacy v0 API. The current API
        documentation is available <Link to="/doc/api">here</Link>.
      </p>
      <ApiDoc
        url={`${legacyApiUrl}/openapi.yaml`}
        title="DraCor API v0"
        configuration={{
          customCss: `
            /* hide the OpenAPI title */
            .introduction-section .section-header { display: none; }
            /* collapse the 2-col header grid so links get full width */
            .introduction-section .section-header-wrapper {
              grid-template-columns: 1fr;
            }
            /* left-align the license / TOS links */
            .introduction-section .section-header-wrapper
              > :last-child
              > div:first-child {
              margin-left: 0;
            }
          `,
        }}
      />
      <Footer />
    </div>
  );
}
