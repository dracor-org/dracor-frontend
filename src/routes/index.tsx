import {createFileRoute, useNavigate} from '@tanstack/react-router';
import DracorCorpusCard from '@dracor/react/DracorCorpusCard';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faArrowDown91,
  faArrowDownAZ,
  faClockRotateLeft,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import {sitemapUrl} from '../config';
import {fetchCorpora, type CorpusListEntry} from '../loaders';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CorporaIntro from '../components/CorporaIntro';

const SORT_KEYS = ['plays', 'name', 'updated'] as const;
type SortKey = (typeof SORT_KEYS)[number];

function isSortKey(value: unknown): value is SortKey {
  return SORT_KEYS.includes(value as SortKey);
}

export const Route = createFileRoute('/')({
  // The default order stays out of the URL, so the plain home page link
  // doesn't grow a `?sort=plays`. `sort` has to be set even when it's
  // dropped: the router lays the result over the raw search params, so
  // leaving it out would let an unknown value through.
  validateSearch: (search: Record<string, unknown>): {sort?: SortKey} => ({
    sort:
      isSortKey(search.sort) && search.sort !== 'plays'
        ? search.sort
        : undefined,
  }),
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

/** The name `DracorCorpusCard` puts in its badge, so the A–Z order follows
 * what the reader sees on the cards. */
function label(corpus: CorpusListEntry): string {
  return corpus.acronym ? corpus.acronym.replace('DraCor', '') : corpus.name;
}

const comparators: Record<
  SortKey,
  (a: CorpusListEntry, b: CorpusListEntry) => number
> = {
  plays: (a, b) => (b.metrics?.plays ?? 0) - (a.metrics?.plays ?? 0),
  name: (a, b) => label(a).localeCompare(label(b), 'en', {sensitivity: 'base'}),
  // ISO timestamps, so comparing the strings orders them by date.
  updated: (a, b) =>
    (b.metrics?.updated ?? '').localeCompare(a.metrics?.updated ?? ''),
};

const sortOptions: {key: SortKey; title: string; icon: IconDefinition}[] = [
  {key: 'plays', title: 'Sort by number of plays', icon: faArrowDown91},
  {key: 'name', title: 'Sort by name', icon: faArrowDownAZ},
  {key: 'updated', title: 'Sort by last update', icon: faClockRotateLeft},
];

function SortButtons({sort}: {sort: SortKey}) {
  const navigate = useNavigate({from: Route.fullPath});

  return (
    <div
      role="group"
      aria-label="Sort corpora"
      className="inline-flex rounded-md border border-primary overflow-hidden"
    >
      {sortOptions.map(({key, title, icon}) => (
        <button
          key={key}
          type="button"
          title={title}
          aria-label={title}
          aria-pressed={sort === key}
          onClick={() =>
            navigate({
              search: key === 'plays' ? {} : {sort: key},
              replace: true,
            })
          }
          className={`px-3 py-1.5 text-sm cursor-pointer not-first:border-l border-primary ${
            sort === key
              ? 'bg-primary text-white'
              : 'bg-white text-primary hover:bg-secondary-100'
          }`}
        >
          <FontAwesomeIcon icon={icon} />
        </button>
      ))}
    </div>
  );
}

function HomeRoute() {
  const {corpora, failed} = Route.useLoaderData();
  const {sort = 'plays'} = Route.useSearch();
  const sorted = [...corpora].sort(comparators[sort]);

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
          <div className="flex justify-center px-4 pb-4">
            <SortButtons sort={sort} />
          </div>
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
