import {createFileRoute} from '@tanstack/react-router';
import {DracorCorpusCard} from '@dracor/react';
import {sitemapUrl} from '../config';
import {fetchCorpora, type CorpusListEntry} from '../loaders';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const Route = createFileRoute('/')({
  loader: () => fetchCorpora(true),
  component: HomeRoute,
});

function byPlaysDesc(a: CorpusListEntry, b: CorpusListEntry): number {
  return (b.metrics?.plays ?? 0) - (a.metrics?.plays ?? 0);
}

function HomeRoute() {
  const corpora = Route.useLoaderData();
  const sorted = [...corpora].sort(byPlaysDesc);

  return (
    <>
      <title>Home - DraCor</title>
      <div className="container-fluid" style={{zIndex: 1}}>
        <Header>DraCor - Open Infrastructure for Drama Analysis</Header>
      </div>
      {sorted.length === 0 ? (
        <p className="loading">No corpora found</p>
      ) : (
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
      )}
      <div className="container-fluid">
        <Footer withSitemap={!!sitemapUrl} />
      </div>
    </>
  );
}
