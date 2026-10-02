import {http, HttpResponse} from 'msw';
import {screen} from '@testing-library/react';
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
