import {http, HttpResponse} from 'msw';
import {screen} from '@testing-library/react';
import {server} from '../mocks/server';
import {renderRoute} from '../testUtils';
import {version} from '../config';

test('renders the navigation shell around every route', async () => {
  await renderRoute('/');
  const nav = await screen.findByRole('navigation');
  expect(nav).toBeInTheDocument();
  expect(screen.getByRole('link', {name: 'DraCor logo'})).toHaveAttribute(
    'href',
    '/'
  );
});

test('surfaces the API info from the root loader in the footer', async () => {
  await renderRoute('/');
  expect(await screen.findByText(/DraCor API/)).toBeInTheDocument();
  expect(screen.getByText('1.0.0')).toBeInTheDocument();
  expect(screen.getByText(version)).toBeInTheDocument();
});

test('still renders the shell when /info fails', async () => {
  // The root loader swallows this so a backend hiccup doesn't blank the app.
  server.use(http.get('*/info', () => new HttpResponse(null, {status: 503})));
  await renderRoute('/');
  expect(await screen.findByRole('navigation')).toBeInTheDocument();
  expect(screen.getByText('Test Drama Corpus')).toBeInTheDocument();
});

test('still renders the shell when /corpora fails', async () => {
  // Both the root loader and the Home route fetch `/corpora`; neither may
  // throw past the shell.
  server.use(
    http.get('*/corpora', () => new HttpResponse(null, {status: 503}))
  );
  await renderRoute('/');
  expect(await screen.findByRole('navigation')).toBeInTheDocument();
  expect(
    screen.getByText(/Could not load the corpus list/)
  ).toBeInTheDocument();
});
