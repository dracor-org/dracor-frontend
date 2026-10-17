import {createFileRoute} from '@tanstack/react-router';
import DracorCorpusCard from '@dracor/react/DracorCorpusCard';
import {sitemapUrl} from '../config';
import {fetchCorpora, type CorpusListEntry} from '../loaders';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CorporaIntro from '../components/CorporaIntro';

export const Route = createFileRoute('/')({
  // Swallow the failure like the root loader does, so a backend hiccup leaves
  // the shell standing instead of throwing the whole page to the error
  // boundary. `failed` keeps "the API is down" distinguishable from "the API
  // returned nothing".
  loader: async () => {
    try {
      return {corpora: await fetchCorpora(true), failed: false};
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load corpora:', error);
      return {corpora: [] as CorpusListEntry[], failed: true};
    }
  },
  component: HomeRoute,
});

function byPlaysDesc(a: CorpusListEntry, b: CorpusListEntry): number {
  return (b.metrics?.plays ?? 0) - (a.metrics?.plays ?? 0);
}

function HomeRoute() {
  const {corpora, failed} = Route.useLoaderData();
  const sorted = [...corpora].sort(byPlaysDesc);

  return (
    <>
      <title>Home - DraCor</title>
      <div className="w-full px-3.75 mx-auto" style={{zIndex: 1}}>
        <Header>DraCor - Open Infrastructure for Drama Analysis</Header>
      </div>
      {failed ? (
        <p className="loading">
          Could not load the corpus list. Please try again later.
        </p>
      ) : sorted.length === 0 ? (
        <p className="loading">No corpora found</p>
      ) : (
        <>
          <CorporaIntro />
          <div className="flex flex-row flex-wrap justify-center gap-4 px-4 pb-4">
            {sorted.map((corpus) =>
              corpus.metrics ? (
                <div key={corpus.name} className="w-full md:w-96">
                  <DracorCorpusCard
                    name={corpus.name}
                    title={corpus.title}
                    to={`/${corpus.name}`}
                    acronym={corpus.acronym}
                    commit={corpus.commit}
                    repo={corpus.repository}
                    metrics={corpus.metrics}
                  />
                </div>
              ) : null
            )}
          </div>
        </>
      )}
      <div className="w-full px-3.75 mx-auto">
        <Footer withSitemap={!!sitemapUrl} />
      </div>
    </>
  );
}
