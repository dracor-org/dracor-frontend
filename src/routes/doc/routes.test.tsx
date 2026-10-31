import {http, HttpResponse} from 'msw';
import {screen} from '@testing-library/react';
import {server} from '../../mocks/server';
import {renderRoute} from '../../testUtils';

// Scalar's bundle imports a stylesheet that Vitest's node runner cannot
// resolve, so the API docs route is exercised with the component stubbed.
vi.mock('@dracor/react/ApiDoc', () => ({
  default: ({url}: {url: string}) => <div data-testid="api-doc">{url}</div>,
}));

describe('/doc/$slug', () => {
  test('renders the fetched markdown', async () => {
    expect(await docPage()).toBeInTheDocument();
  });

  async function docPage() {
    await renderRoute('/doc/about');
    return screen.findByText('A paragraph rendered by the doc page test.');
  }

  test('promotes the markdown h1 into the page header', async () => {
    await renderRoute('/doc/about');
    expect(
      await screen.findByRole('heading', {name: 'About DraCor'})
    ).toBeInTheDocument();
  });

  test('requests the markdown file matching the slug', async () => {
    let requested: string | undefined;
    server.use(
      http.get('*/doc/:slug.md', ({request}) => {
        requested = new URL(request.url).pathname;
        return HttpResponse.text('# Imprint\n', {
          headers: {'Content-Type': 'text/markdown'},
        });
      })
    );
    await renderRoute('/doc/imprint');
    await screen.findByRole('heading', {name: 'Imprint'});
    expect(requested).toBe('/doc/imprint.md');
  });
});

describe('/doc/api', () => {
  test('points the API docs at the configured OpenAPI spec', async () => {
    await renderRoute('/doc/api');
    expect(await screen.findByTestId('api-doc')).toHaveTextContent(
      '/api/v1/openapi.yaml'
    );
  });

  test('renders the page header', async () => {
    await renderRoute('/doc/api');
    expect(
      await screen.findByRole('heading', {name: 'DraCor API'})
    ).toBeInTheDocument();
  });
});

describe('/doc/legacy/api', () => {
  test('is not found when VITE_DRACOR_LEGACY_API is unset', async () => {
    await renderRoute('/doc/legacy/api');
    expect(await screen.findByText('Not Found')).toBeInTheDocument();
  });
});

describe('/sparql', () => {
  test('shows the placeholder when SPARQL is disabled', async () => {
    await renderRoute('/sparql');
    expect(
      await screen.findByText(/RDF endpoints are currently being revised/)
    ).toBeInTheDocument();
  });
});
