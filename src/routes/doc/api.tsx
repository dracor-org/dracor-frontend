import {createFileRoute} from '@tanstack/react-router';
import {Suspense, lazy} from 'react';
import {apiUrl} from '../../config';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// `ApiDoc` pulls in Scalar (~2 MB). Load it lazily so it only lands
// on the wire when the API docs route mounts.
const ApiDoc = lazy(() =>
  import('@dracor/react').then((m) => ({default: m.ApiDoc}))
);

export const Route = createFileRoute('/doc/api')({
  component: ApiDocRoute,
});

function ApiDocRoute() {
  return (
    <div className="w-full px-3.75 mx-auto">
      <title>API Documentation - DraCor</title>
      <Header>DraCor API</Header>
      <Suspense fallback={<p className="loading">Loading…</p>}>
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
      </Suspense>
      <Footer />
    </div>
  );
}
