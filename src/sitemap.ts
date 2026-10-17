import {Sitemap} from './types';
import {ezlinavisUrl} from './config';

/**
 * Whether `href` is linked anywhere in the sitemap, either as a top level
 * entry or inside one of its nodes. Deployments ship their own sitemap (see
 * `VITE_SITEMAP_URL`), so this is how a component can tell whether a page
 * like `/doc/research` exists on the current instance.
 */
export function sitemapHasHref(sitemap: Sitemap, href: string): boolean {
  return sitemap.some((entry) => {
    if ('items' in entry) {
      return entry.items.some((item) => 'href' in item && item.href === href);
    }
    return 'href' in entry && entry.href === href;
  });
}

const sitemap: Sitemap = [
  {component: 'CorporaDropdown'},
  {
    label: 'Documentation',
    items: [
      {label: 'API', href: '/doc/api'},
      {label: 'Encoding Guidelines (ODD)', href: '/doc/odd'},
      {
        label: 'DraCor Textbook',
        href: 'https://dracor-org.github.io/dracor-textbook/',
      },
    ],
  },
  {
    label: 'Tools',
    items: [
      {
        label: 'pydracor',
        href: 'https://pypi.org/project/pydracor/',
      },
      {
        label: 'rdracor',
        href: 'https://github.com/dracor-org/rdracor',
      },
      {label: 'SPARQL', href: '/sparql'},
      {label: 'ezlinavis', href: ezlinavisUrl},
    ],
  },
];

export default sitemap;
