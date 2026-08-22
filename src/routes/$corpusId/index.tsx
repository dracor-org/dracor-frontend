import {createFileRoute, notFound} from '@tanstack/react-router';
import {Helmet} from 'react-helmet';
import {fetchCorpus, isNotFound} from '../../loaders';
import Corpus from '../../components/Corpus';

export const Route = createFileRoute('/$corpusId/')({
  loader: async ({params}) => {
    try {
      return await fetchCorpus(params.corpusId);
    } catch (error) {
      if (isNotFound(error)) throw notFound();
      throw error;
    }
  },
  notFoundComponent: () => <NotFound />,
  component: CorpusRoute,
});

function NotFound() {
  const {corpusId} = Route.useParams();
  return (
    <p className="loading">
      No such corpus <em>{corpusId}</em>.
    </p>
  );
}

function CorpusRoute() {
  const corpus = Route.useLoaderData();
  return (
    <>
      <Helmet titleTemplate="%s - DraCor">
        <title>{corpus.title}</title>
      </Helmet>
      <Corpus corpus={corpus} />
    </>
  );
}
