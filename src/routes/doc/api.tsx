import {createFileRoute} from '@tanstack/react-router';
import {ApiDoc} from '@dracor/react';
import {apiUrl} from '../../config';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const Route = createFileRoute('/doc/api')({
  component: ApiDocRoute,
});

function ApiDocRoute() {
  return (
    <div className="container-fluid">
      <title>API Documentation - DraCor</title>
      <Header>DraCor API</Header>
      <ApiDoc
        url={`${apiUrl}/openapi.yaml`}
        title="DraCor API"
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
