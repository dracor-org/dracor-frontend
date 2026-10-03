import {http, HttpResponse} from 'msw';
import {screen, waitFor} from '@testing-library/react';
import {server} from '../mocks/server';
import {renderRoutePending} from '../testUtils';
import * as fixtures from '../mocks/fixtures';

/**
 * The root loader fetches `/info` and `/corpora` before the shell can render.
 * Until this skeleton existed the page was blank for the whole of that wait —
 * just the navy/light background from index.css, which reads as broken.
 */
test('shows the skeleton while the root loader is in flight', async () => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  server.use(
    http.get('*/info', async () => {
      await held;
      return HttpResponse.json(fixtures.apiInfo);
    })
  );

  renderRoutePending('/');

  expect(await screen.findByLabelText('Loading DraCor')).toBeInTheDocument();
  // The real shell must not be up yet.
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();

  release();

  await waitFor(() =>
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  );
  expect(screen.queryByLabelText('Loading DraCor')).not.toBeInTheDocument();
});

test('marks the skeleton busy for assistive technology', async () => {
  const held = new Promise<void>(() => {});
  server.use(
    http.get('*/info', async () => {
      await held;
      return HttpResponse.json(fixtures.apiInfo);
    })
  );

  renderRoutePending('/');

  const skeleton = await screen.findByLabelText('Loading DraCor');
  expect(skeleton).toHaveAttribute('aria-busy', 'true');
});
