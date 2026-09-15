// Migrate legacy #tab URLs (`/{corpus}/{play}#network` etc.) to path segments
// (`/{corpus}/{play}/network`). Runs once on first mount; harmless when the
// hash is empty or already matches a non-tab anchor.

const VALID_TABS = new Set([
  'network',
  'relations',
  'speech',
  'text',
  'downloads',
  'tools',
]);

export function migrateLegacyHash(): string | null {
  if (typeof window === 'undefined') return null;
  const {pathname, hash, search} = window.location;
  if (!hash || !hash.startsWith('#')) return null;
  const tab = hash.slice(1);
  if (!VALID_TABS.has(tab)) return null;

  // Only rewrite on the play-detail URL shape: `/{corpus}/{play}` (2 non-empty
  // segments, no doc/sparql prefix).
  const segments = pathname.replace(/^\/+|\/+$/g, '').split('/');
  if (segments.length !== 2) return null;
  if (segments[0] === 'doc' || segments[0] === 'sparql') return null;

  return `/${segments[0]}/${segments[1]}/${tab}${search}`;
}
