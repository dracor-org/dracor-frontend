import {Sitemap} from './types';
import {ezlinavisUrl} from './config';

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
