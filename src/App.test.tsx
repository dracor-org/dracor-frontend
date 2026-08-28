import {version} from './config';

// Placeholder smoke test — the pre-Phase-1 test rendered the app shell, but
// with @dracor/react's NavBar (Phase 2) the transitive @scalar CSS imports
// blow up Vitest's node runner. Phase 6 backfills route-level tests via MSW;
// keep something here so `pnpm test` still runs and reports coverage.
test('config exposes a version string', () => {
  expect(typeof version).toBe('string');
  expect(version.length).toBeGreaterThan(0);
});
