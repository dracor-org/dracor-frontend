import {ezlinavisUrl, legacyApiUrl, legacyDocPath} from './config';

type SitemapLeaf =
  | {
      label: string;
      href: string;
    }
  | {component: 'CorporaDropdown'};

interface SitemapNode {
  label: string;
  items: SitemapLeaf[];
}

export type Sitemap = (SitemapLeaf | SitemapNode)[];

const sitemap: Sitemap = [
  {
    label: 'About',
    items: [
      {label: 'What is DraCor?', href: '/doc/what-is-dracor'},
      {label: 'Corpus registry', href: '/doc/corpora'},
      {label: 'Credits', href: '/doc/credits'},
      {label: 'Get in Touch', href: '/doc/get-in-touch'},
      {label: 'DraCor Moments', href: '/doc/dracor-moments'},
      {label: 'DraCor Summit 2025', href: 'https://summit.dracor.org/'},
      {label: 'Merch', href: '/doc/merch'},
      {label: 'Media Kit', href: '/doc/media-kit'},
      {label: 'Imprint', href: '/doc/imprint-and-gdpr'},
    ],
  },
  {component: 'CorporaDropdown'},
  {
    label: 'Documentation',
    items: [
      {label: 'API', href: '/doc/api'},
      legacyApiUrl ? {label: 'API v0 (legacy)', href: legacyDocPath} : null,
      {label: 'Encoding Guidelines (ODD)', href: '/doc/odd'},
      {label: 'FAQ', href: '/doc/merch'},
      {label: 'Tutorials', href: '/doc/tutorials'},
      {
        label: 'DraCor Textbook',
        href: 'https://dracor-org.github.io/dracor-textbook/',
      },
    ].filter((item) => item) as SitemapLeaf[],
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
  {
    label: 'Research',
    items: [
      {label: 'Research Bibliography', href: '/doc/research'},
      {label: 'Posters', href: '/doc/posters'},
      {label: 'Card Games', href: '/doc/card-games'},
      {
        label: 'DraCor in Science Communication',
        href: '/doc/science-comm',
      },
    ],
  },
];

export default sitemap;
