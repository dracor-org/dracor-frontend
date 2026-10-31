import {http, HttpResponse} from 'msw';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {server} from '../mocks/server';
import {makeMetrics} from '../mocks/fixtures';
import {renderRoute} from '../testUtils';

test('lists every corpus that has metrics', async () => {
  await renderRoute('/');
  expect(await screen.findByText('Test Drama Corpus')).toBeInTheDocument();
  expect(screen.getByText('Small Drama Corpus')).toBeInTheDocument();
});

test('links each card to its corpus route', async () => {
  await renderRoute('/');
  const link = await screen.findByRole('link', {name: /Test Drama Corpus/});
  expect(link).toHaveAttribute('href', '/test');
});

test('sorts corpora by play count, descending', async () => {
  server.use(
    http.get('*/corpora', () =>
      HttpResponse.json([
        {name: 'tiny', title: 'Tiny Corpus', metrics: makeMetrics({plays: 1})},
        {name: 'huge', title: 'Huge Corpus', metrics: makeMetrics({plays: 99})},
      ])
    )
  );
  await renderRoute('/');
  const headings = await screen.findAllByText(/Corpus$/);
  expect(headings.map((h) => h.textContent)).toEqual([
    'Huge Corpus',
    'Tiny Corpus',
  ]);
});

function mockThreeCorpora() {
  server.use(
    http.get('*/corpora', () =>
      HttpResponse.json([
        {
          name: 'beta',
          title: 'Beta Corpus',
          acronym: 'BetaDraCor',
          metrics: makeMetrics({plays: 9, updated: '2026-03-01T00:00:00Z'}),
        },
        {
          name: 'gamma',
          title: 'Gamma Corpus',
          metrics: makeMetrics({plays: 1, updated: '2026-05-01T00:00:00Z'}),
        },
        {
          name: 'alpha',
          title: 'Alpha Corpus',
          acronym: 'AlphaDraCor',
          metrics: makeMetrics({plays: 5, updated: '2026-01-01T00:00:00Z'}),
        },
      ])
    )
  );
}

async function cardTitles() {
  const headings = await screen.findAllByText(/Corpus$/);
  return headings.map((h) => h.textContent);
}

test('re-sorts the corpora with the sort buttons', async () => {
  mockThreeCorpora();
  const {router} = await renderRoute('/');
  expect(await cardTitles()).toEqual([
    'Beta Corpus',
    'Alpha Corpus',
    'Gamma Corpus',
  ]);
  expect(
    screen.getByRole('button', {name: 'Sort by number of plays'})
  ).toHaveAttribute('aria-pressed', 'true');

  await userEvent.click(screen.getByRole('button', {name: 'Sort by name'}));
  expect(await cardTitles()).toEqual([
    'Alpha Corpus',
    'Beta Corpus',
    'Gamma Corpus',
  ]);
  expect(router.state.location.search).toEqual({sort: 'name'});

  await userEvent.click(
    screen.getByRole('button', {name: 'Sort by last update'})
  );
  expect(await cardTitles()).toEqual([
    'Gamma Corpus',
    'Beta Corpus',
    'Alpha Corpus',
  ]);

  await userEvent.click(
    screen.getByRole('button', {name: 'Sort by number of plays'})
  );
  expect(await cardTitles()).toEqual([
    'Beta Corpus',
    'Alpha Corpus',
    'Gamma Corpus',
  ]);
  expect(router.state.location.search).toEqual({});
});

test('takes the sort order from the URL', async () => {
  mockThreeCorpora();
  await renderRoute('/?sort=updated');
  expect(await cardTitles()).toEqual([
    'Gamma Corpus',
    'Beta Corpus',
    'Alpha Corpus',
  ]);
  expect(
    screen.getByRole('button', {name: 'Sort by last update'})
  ).toHaveAttribute('aria-pressed', 'true');
});

test('falls back to play count for an unknown sort key', async () => {
  mockThreeCorpora();
  await renderRoute('/?sort=bogus');
  expect(
    screen.getByRole('button', {name: 'Sort by number of plays'})
  ).toHaveAttribute('aria-pressed', 'true');
});

// The intro advertises the research bibliography, which only dracor.org
// publishes. `.env.test` leaves VITE_SITEMAP_URL empty, so the bundled
// fallback sitemap applies — and it has no bibliography entry.
test('leaves out the corpora intro when the sitemap has no bibliography', async () => {
  await renderRoute('/');
  expect(await screen.findByText('Test Drama Corpus')).toBeInTheDocument();
  expect(screen.queryByText(/Explore the corpora/)).not.toBeInTheDocument();
});

test('shows a message when the API returns no corpora', async () => {
  server.use(http.get('*/corpora', () => HttpResponse.json([])));
  await renderRoute('/');
  expect(await screen.findByText('No corpora found')).toBeInTheDocument();
});

test('skips corpora that have no metrics', async () => {
  server.use(
    http.get('*/corpora', () =>
      HttpResponse.json([
        {name: 'nometrics', title: 'Unmeasured Corpus'},
        {name: 'ok', title: 'Measured Corpus', metrics: makeMetrics()},
      ])
    )
  );
  await renderRoute('/');
  expect(await screen.findByText('Measured Corpus')).toBeInTheDocument();
  expect(screen.queryByText('Unmeasured Corpus')).not.toBeInTheDocument();
});

test('keeps the shell and reports the failure when /corpora errors', async () => {
  server.use(
    http.get('*/corpora', () => new HttpResponse(null, {status: 503}))
  );
  await renderRoute('/');
  // The shell must survive — a backend hiccup used to throw past it and
  // render the error boundary instead of the page.
  expect(await screen.findByRole('navigation')).toBeInTheDocument();
  expect(
    screen.getByText(/Could not load the corpus list/)
  ).toBeInTheDocument();
  // ...and it must not masquerade as an empty API response.
  expect(screen.queryByText('No corpora found')).not.toBeInTheDocument();
});
