import {lazy, Suspense} from 'react';
import {createFileRoute} from '@tanstack/react-router';

const SparqlUi = lazy(() => {
  if (import.meta.env.VITE_WITH_SPARQL === 'yes') {
    return import('../components/SparqlUi');
  }
  return import('../components/SparqlPlaceholder');
});

export const Route = createFileRoute('/sparql')({
  component: SparqlRoute,
});

function SparqlRoute() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <SparqlUi />
    </Suspense>
  );
}
