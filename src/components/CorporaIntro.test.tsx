import {http, HttpResponse} from 'msw';
import {screen, waitFor} from '@testing-library/react';
import {server} from '../mocks/server';
import {researchMarkdown} from '../mocks/fixtures';
import {renderWithRouter} from '../testUtils';
import {DracorContext} from '../context';
import {Sitemap} from '../types';
import CorporaIntro, {countPublicationsSince} from './CorporaIntro';

const withResearch: Sitemap = [
  {
    label: 'Research',
    items: [{label: 'Research Bibliography', href: '/doc/research'}],
  },
];

const withoutResearch: Sitemap = [
  {label: 'Documentation', items: [{label: 'API', href: '/doc/api'}]},
];

function renderIntro(sitemap: Sitemap) {
  return renderWithRouter(
    <DracorContext value={{corpora: [], sitemap}}>
      <CorporaIntro />
    </DracorContext>
  );
}

describe('countPublicationsSince', () => {
  test('counts the entries of the cutoff year and later', () => {
    // 2026: 2, 2025: 1, 2024: 1 — the 2023 entry is out of range.
    expect(countPublicationsSince(researchMarkdown, 2024)).toBe(4);
    expect(countPublicationsSince(researchMarkdown, 2026)).toBe(2);
  });

  test('ignores the intro paragraph and wrapped entry lines', () => {
    // The fixture's 2024 entry wraps onto an unbulleted second line; were it
    // counted — or the intro paragraph — this would come out above 1.
    expect(countPublicationsSince(researchMarkdown, 2024)).toBe(
      countPublicationsSince(researchMarkdown, 2025) + 1
    );
  });

  test('counts nothing when no section is recent enough', () => {
    expect(countPublicationsSince(researchMarkdown, 2030)).toBe(0);
  });

  test('counts nothing in markdown without year sections', () => {
    expect(countPublicationsSince('# Research\n\n* An entry.\n', 2024)).toBe(0);
  });
});

describe('CorporaIntro', () => {
  beforeEach(() => {
    server.use(
      http.get('*/doc/research.md', () =>
        HttpResponse.text(researchMarkdown, {
          headers: {'Content-Type': 'text/markdown'},
        })
      )
    );
  });

  test('renders nothing where the sitemap has no bibliography', async () => {
    await renderIntro(withoutResearch);
    expect(screen.queryByText(/Explore the corpora/)).not.toBeInTheDocument();
    // It must not have gone looking for the document either, but a stray
    // fetch can't be caught here: the handler above answers it. The guard is
    // that the effect returns before fetching when the entry is missing.
  });

  test('links to the API docs and the bibliography', async () => {
    await renderIntro(withResearch);
    expect(screen.getByRole('link', {name: 'API'})).toHaveAttribute(
      'href',
      '/doc/api'
    );
    expect(
      await screen.findByRole('link', {name: 'research publications'})
    ).toHaveAttribute('href', '/doc/research');
  });

  test('appends the publication count once the bibliography is read', async () => {
    await renderIntro(withResearch);
    expect(screen.getByText(/Explore the corpora/)).toBeInTheDocument();
    expect(
      await screen.findByText(/We recorded 4 DraCor-based/)
    ).toBeInTheDocument();
    expect(screen.getByText(/since 2024/)).toBeInTheDocument();
  });

  test('keeps the first sentence when the bibliography cannot be read', async () => {
    server.use(
      http.get('*/doc/research.md', () => new HttpResponse(null, {status: 404}))
    );
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await renderIntro(withResearch);
    expect(screen.getByText(/Explore the corpora/)).toBeInTheDocument();
    await waitFor(() => expect(consoleError).toHaveBeenCalled());
    expect(screen.queryByText(/We recorded/)).not.toBeInTheDocument();

    consoleError.mockRestore();
  });
});
