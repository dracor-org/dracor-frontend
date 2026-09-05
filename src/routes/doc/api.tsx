import {createFileRoute} from '@tanstack/react-router';
import {ApiDoc} from '@dracor/react';
import {apiUrl} from '../../config';
import Footer from '../../components/Footer';

export const Route = createFileRoute('/doc/api')({
  component: ApiDocRoute,
});

function ApiDocRoute() {
  return (
    <div className="container-fluid">
      <title>API Documentation - DraCor</title>
      <ApiDoc url={`${apiUrl}/openapi.yaml`} title="DraCor API" />
      <Footer />
    </div>
  );
}
