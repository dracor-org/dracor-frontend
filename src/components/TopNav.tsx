import {use, type ComponentProps} from 'react';
import {NavBar} from '@dracor/react';
import {DracorContext} from '../context';
import {showPrizeBadge, version} from '../config';
import type {Sitemap} from '../types';
import svgTEI from '../images/TEI-Logo.svg';
import svgDracorLogo from '../images/DraCor-white.svg';

// NavBar accepts (NavItem | NavMenu) entries where NavItem extends TanStack
// Router's LinkProps. Once router type-registration kicks in that restricts
// `to` to declared route ids — too tight for our dynamic corpus links. We
// build with a loose local shape and cast at the NavBar boundary.
type CorpusEntry = {name: string; title: string};
type NavEntry = {
  label: string;
  to?: string;
  params?: Record<string, string>;
  href?: string;
  items?: NavEntry[];
};

function toLink(label: string, href: string): NavEntry {
  return /^https?:/i.test(href) ? {label, href} : {label, to: href};
}

function buildNavItems(sitemap: Sitemap, corpora: CorpusEntry[]): NavEntry[] {
  const out: NavEntry[] = [];
  for (const entry of sitemap) {
    if ('component' in entry && entry.component === 'CorporaDropdown') {
      out.push({
        label: 'Corpora',
        items: corpora.map((c) => ({
          label: c.title,
          to: '/$corpusId',
          params: {corpusId: c.name},
        })),
      });
    } else if ('items' in entry) {
      out.push({
        label: entry.label,
        items: entry.items
          .filter(
            (i): i is {label: string; href: string} =>
              typeof (i as {href?: string}).href === 'string'
          )
          .map((i) => toLink(i.label, i.href)),
      });
    } else if ('href' in entry) {
      out.push(toLink(entry.label, entry.href));
    }
  }
  return out;
}

// Rahtz Prize badge shown when VITE_WITH_RAHTZ_PRIZE=yes. Rendered inside
// NavBar via the new v1.5.0 `badge` slot. Mirrors the production dracor.org
// pill: fixed width, hangs below the nav bar via negative top margin, rounded
// bottom corners, TEI shield fills the width. Dimensions are anchored to
// `--bootstrap-padding` (15px) to match the pre-Phase-2 look.
const prizeBadge = (
  <a
    href="https://tei-c.org/activities/rahtz-prize-for-tei-ingenuity/"
    title="Rahtz Prize for TEI Ingenuity 2022"
    className="flex flex-col items-center bg-white text-primary hover:no-underline"
    style={{
      width: 'calc(3 * var(--bootstrap-padding))',
      padding: '0.3em',
      marginLeft: 'var(--bootstrap-padding)',
      marginTop: '-1rem',
      borderRadius:
        '0 0 calc(1.5 * var(--bootstrap-padding)) calc(1.5 * var(--bootstrap-padding))',
    }}
  >
    <span
      className="uppercase whitespace-nowrap"
      style={{
        fontSize: 'calc(0.375 * var(--bootstrap-padding))',
        lineHeight: '0.75',
      }}
    >
      Rahtz Prize
    </span>
    <span style={{fontSize: 'var(--bootstrap-padding)', lineHeight: '1.1'}}>
      2022
    </span>
    <img
      src={svgTEI}
      alt="TEI Logo"
      style={{width: '100%', padding: '0.1em', marginBottom: '-0.2em'}}
    />
  </a>
);

type NavBarItems = ComponentProps<typeof NavBar>['navItems'];

const TopNav = ({sitemap}: {sitemap: Sitemap}) => {
  const {corpora = []} = use(DracorContext);
  const navItems = buildNavItems(
    sitemap,
    corpora as CorpusEntry[]
  ) as unknown as NavBarItems;
  return (
    // Stacking context wrapper: without this, NavMenu's absolute-positioned
    // dropdowns render *behind* Bootstrap-styled page content (which sits at
    // z-index 0 in a new stacking context created by the shell's flex column
    // + `#root` background). `relative z-50` lifts the whole nav + its
    // dropdowns above the outlet content.
    <div className="relative z-50">
      <NavBar
        title="DraCor"
        logo={svgDracorLogo}
        version={version}
        gitHubUrl="https://github.com/dracor-org"
        gitHubTitle="DraCor GitHub"
        navItems={navItems}
        badge={showPrizeBadge ? prizeBadge : undefined}
      />
    </div>
  );
};

export default TopNav;
