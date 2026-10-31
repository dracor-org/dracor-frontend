import {use, useEffect, useState} from 'react';
import {Link} from '@tanstack/react-router';
import {DracorContext} from '../context';
import {sitemapHasHref} from '../sitemap';

/** Path of the research bibliography, both as a route and as its source. */
const RESEARCH_PATH = '/doc/research';

/** Entries older than this are left out of the advertised count. */
const SINCE_YEAR = 2024;

/**
 * Count the bibliography entries published in `year` or later.
 *
 * The document is a flat list of `## <year>` sections, each followed by one
 * list item per publication. Entries that wrap onto a second line do so
 * without a leading bullet, so counting bullets at the start of a line
 * matches exactly the list items react-markdown renders on the doc page.
 */
export function countPublicationsSince(markdown: string, year: number): number {
  let section: number | null = null;
  let count = 0;

  for (const line of markdown.split('\n')) {
    const heading = /^##\s+(\d{4})\s*$/.exec(line);
    if (heading) {
      section = Number(heading[1]);
    } else if (section !== null && section >= year && /^[*-]\s/.test(line)) {
      count++;
    }
  }

  return count;
}

/**
 * Introductory line above the corpus cards on the home page. It advertises
 * the research bibliography, which only some deployments publish, so the
 * whole paragraph is skipped where the sitemap doesn't link to it.
 */
export default function CorporaIntro() {
  const {sitemap = []} = use(DracorContext);
  const hasResearch = sitemapHasHref(sitemap, RESEARCH_PATH);
  const [publications, setPublications] = useState<number | null>(null);

  useEffect(() => {
    if (!hasResearch) {
      return;
    }

    let cancelled = false;

    async function fetchPublicationCount() {
      try {
        const response = await fetch(`${RESEARCH_PATH}.md`);
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const markdown = await response.text();
        if (!cancelled) {
          setPublications(countPublicationsSince(markdown, SINCE_YEAR));
        }
      } catch (error) {
        // Not worth bothering the reader about: the sentence simply stays
        // out until the bibliography can be read.
        // eslint-disable-next-line no-console
        console.error('Failed to count research publications:', error);
      }
    }

    fetchPublicationCount();

    return () => {
      cancelled = true;
    };
  }, [hasResearch]);

  if (!hasResearch) {
    return null;
  }

  return (
    <div className="px-4 pb-4">
      <p className="max-w-3xl mx-auto text-center mb-0">
        Explore the corpora by clicking on the cards, or use our{' '}
        <Link to="/doc/api">API</Link> for your research.
        {publications !== null && (
          <>
            {' '}
            We recorded {publications} DraCor-based{' '}
            <Link to="/doc/$slug" params={{slug: 'research'}}>
              research publications
            </Link>{' '}
            since {SINCE_YEAR}.
          </>
        )}
      </p>
    </div>
  );
}
