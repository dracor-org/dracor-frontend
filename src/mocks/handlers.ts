import {http, HttpResponse} from 'msw';
import * as fixtures from './fixtures';

const notFound = () => new HttpResponse(null, {status: 404});

// Handlers are matched with a leading `*` so they work regardless of whether
// `VITE_DRACOR_API` is an absolute URL or the relative `/api/v1` proxy path.
export const handlers = [
  http.get('*/info', () => HttpResponse.json(fixtures.apiInfo)),

  http.get('*/corpora', () => HttpResponse.json(fixtures.corpora)),

  http.get('*/corpora/:corpusId', ({params}) =>
    params.corpusId === fixtures.corpus.name
      ? HttpResponse.json(fixtures.corpus)
      : notFound()
  ),

  http.get('*/corpora/:corpusId/plays/:playId', ({params}) =>
    params.corpusId === fixtures.play.corpus &&
    params.playId === fixtures.play.name
      ? HttpResponse.json(fixtures.play)
      : notFound()
  ),

  http.get('*/corpora/:corpusId/plays/:playId/metrics', ({params}) =>
    params.corpusId === fixtures.play.corpus &&
    params.playId === fixtures.play.name
      ? HttpResponse.json(fixtures.playMetrics)
      : notFound()
  ),

  http.get('*/corpora/:corpusId/plays/:playId/tei', () =>
    HttpResponse.text(fixtures.playTei, {
      headers: {'Content-Type': 'application/xml'},
    })
  ),

  // No Wikidata record by default — AuthorInfo falls back to the plain name.
  http.get('*/wikidata/author/:id', () => notFound()),

  // DocPage refuses anything that isn't served as `text/markdown`.
  http.get('*/doc/:slug.md', () =>
    HttpResponse.text(fixtures.docMarkdown, {
      headers: {'Content-Type': 'text/markdown'},
    })
  ),
];
