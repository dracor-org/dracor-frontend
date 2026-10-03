import {http, HttpResponse} from 'msw';
import {server} from './mocks/server';
import {
  fetchApiInfo,
  fetchCorpora,
  fetchCorpus,
  fetchPlay,
  fetchPlayMetrics,
  fetchWikidataAuthor,
  isNotFound,
} from './loaders';

test('fetchApiInfo returns the parsed /info payload', async () => {
  await expect(fetchApiInfo()).resolves.toMatchObject({name: 'DraCor API'});
});

test('fetchCorpora returns the corpus list', async () => {
  const corpora = await fetchCorpora();
  expect(corpora.map((c) => c.name)).toEqual(['test', 'small']);
});

test('fetchCorpora requests metrics when asked', async () => {
  let requested: string | undefined;
  server.use(
    http.get('*/corpora', ({request}) => {
      requested = new URL(request.url).search;
      return HttpResponse.json([]);
    })
  );
  await fetchCorpora(true);
  expect(requested).toBe('?include=metrics');
});

describe('fetchCorpus derives the fields CorpusIndex reads', () => {
  test('joins author names', async () => {
    const corpus = await fetchCorpus('test');
    expect(corpus.plays[0].authorNames).toBe('Mustermann, Maria');
  });

  test('falls back to Anonymous when a play has no authors', async () => {
    const corpus = await fetchCorpus('test');
    const anonymous = corpus.plays[1];
    expect(anonymous.authorNames).toBe('Anonymous');
    expect(anonymous.authors).toEqual([]);
  });

  test('picks translators out of the editors list', async () => {
    const corpus = await fetchCorpus('test');
    expect(corpus.plays[0].translatorNames).toBe('Beispiel, Bernd');
    expect(corpus.plays[1].translators).toEqual([]);
  });

  test('coerces networkSize to a number', async () => {
    const corpus = await fetchCorpus('test');
    expect(corpus.plays.map((p) => p.networkSize)).toEqual([4, 2]);
  });
});

test('fetchPlay and fetchPlayMetrics resolve for a known play', async () => {
  const [play, metrics] = await Promise.all([
    fetchPlay('test', 'mustermann-mustertragoedie'),
    fetchPlayMetrics('test', 'mustermann-mustertragoedie'),
  ]);
  expect(play.title).toBe('Mustertragödie');
  expect(metrics.size).toBe(4);
});

test('a 404 surfaces as an error isNotFound() recognises', async () => {
  const error = await fetchCorpus('nope').catch((e) => e);
  expect(isNotFound(error)).toBe(true);
});

test('isNotFound is false for other failures', async () => {
  server.use(
    http.get('*/corpora/:corpusId', () => new HttpResponse(null, {status: 500}))
  );
  const error = await fetchCorpus('test').catch((e) => e);
  expect(isNotFound(error)).toBe(false);
});

test('fetchWikidataAuthor returns null instead of throwing on 404', async () => {
  await expect(fetchWikidataAuthor('Q404')).resolves.toBeNull();
});

test('fetchWikidataAuthor returns the record when there is one', async () => {
  server.use(
    http.get('*/wikidata/author/:id', () =>
      HttpResponse.json({name: 'Maria Mustermann', birthDate: '1750'})
    )
  );
  await expect(fetchWikidataAuthor('Q1')).resolves.toMatchObject({
    name: 'Maria Mustermann',
  });
});
