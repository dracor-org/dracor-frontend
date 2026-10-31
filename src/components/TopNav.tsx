import {use, type ComponentProps} from 'react';
import NavBar from '@dracor/react/NavBar';
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
// pill: on desktop a fixed-width white pill that hangs below the nav bar via
// negative top margin, rounded bottom corners, TEI shield fills the width. In
// the collapsed mobile menu it reads as a regular nav entry ("Rahtz Prize
// 2022") followed by a small round TEI logo.
const prizeBadge = (
  <a
    href="https://tei-c.org/activities/rahtz-prize-for-tei-ingenuity/"
    title="Rahtz Prize for TEI Ingenuity 2022"
    className={
      'mt-4 flex items-center gap-[0.3em] uppercase text-white ' +
      'hover:text-blue-100 hover:no-underline ' +
      'md:-mt-4 md:ml-[15px] md:w-[45px] md:flex-col md:gap-0 ' +
      'md:rounded-b-[22.5px] md:bg-white md:p-[0.3em] md:normal-case ' +
      'md:text-primary md:hover:text-primary'
    }
  >
    <span className="md:whitespace-nowrap md:text-[5.625px] md:leading-[0.75] md:uppercase">
      Rahtz Prize
    </span>
    <span className="md:text-[15px] md:leading-[1.1]">2022</span>
    <img
      src={svgTEI}
      alt="TEI Logo"
      className={
        'w-[1.5em] rounded-full bg-white p-[0.15em] ' +
        'md:mb-[-0.2em] md:w-full md:rounded-none md:bg-transparent md:p-[0.1em]'
      }
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
