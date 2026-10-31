import {http, HttpResponse, delay} from 'msw';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {server} from '../mocks/server';
import {renderRoute} from '../testUtils';

test('the bar is idle once a route has settled', async () => {
  await renderRoute('/');
  await screen.findByText('Test Drama Corpus');
  const bar = screen.getByRole('progressbar', {hidden: true});
  expect(bar).toHaveAttribute('aria-hidden', 'true');
  expect(bar.firstChild).toBeNull();
});

test('the bar appears while a route loader is in flight', async () => {
  await renderRoute('/');
  await screen.findByText('Test Drama Corpus');

  // Hold the corpus loader open so the pending state is observable.
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  server.use(
    http.get('*/corpora/:corpusId', async () => {
      await held;
      await delay(0);
      return HttpResponse.json({name: 'test', title: 'Test', plays: []});
    })
  );

  await userEvent.click(
    await screen.findByRole('link', {name: /Test Drama Corpus/})
  );

  await waitFor(() =>
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Loading page'
    )
  );

  release();
  await waitFor(() =>
    expect(screen.getByRole('progressbar', {hidden: true})).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  );
});
