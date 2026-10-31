import {sitemapHasHref} from './sitemap';
import {Sitemap} from './types';

const sitemap: Sitemap = [
  {component: 'CorporaDropdown'},
  {label: 'Imprint', href: '/doc/imprint-and-gdpr'},
  {
    label: 'Research',
    items: [
      {label: 'Research Bibliography', href: '/doc/research'},
      {label: 'Posters', href: '/doc/posters'},
    ],
  },
];

test('finds an href nested in a node', () => {
  expect(sitemapHasHref(sitemap, '/doc/research')).toBe(true);
});

test('finds an href at the top level', () => {
  expect(sitemapHasHref(sitemap, '/doc/imprint-and-gdpr')).toBe(true);
});

test('reports an href the sitemap does not link to', () => {
  expect(sitemapHasHref(sitemap, '/doc/tutorials')).toBe(false);
});

// `{component: 'CorporaDropdown'}` entries have no `href` at all.
test('skips component entries instead of tripping over them', () => {
  expect(
    sitemapHasHref([{component: 'CorporaDropdown'}], '/doc/research')
  ).toBe(false);
});

test('handles an empty sitemap', () => {
  expect(sitemapHasHref([], '/doc/research')).toBe(false);
});
