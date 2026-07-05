# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `packageManager` field in [package.json](package.json)).

- `pnpm start` — dev server on http://localhost:5173 (Vite). Proxies `/api/v1` to `http://localhost:8080/exist/restxq/v1` by default. Override the proxy target path with `PROXY_PATH=...` and skip the proxy entirely by pointing the app at a remote API via `VITE_DRACOR_API=https://dracor.org/api/v1 pnpm start`.
- `pnpm build` — production build to `build/`.
- `pnpm serve` — preview the production build.
- `pnpm test` — [Vitest](https://vitest.dev) in watch mode (jsdom env, setup file `src/setupTests.ts`).
- `pnpm test -- src/App.test.tsx` — run a single test file. `pnpm vitest run -t "pattern"` filters by test name.
- `pnpm test:coverage` — one-shot coverage report.
- `pnpm lint` — ESLint over `src`. Lint is *not* wired into the Vite dev server or build, so it only runs on explicit `pnpm lint`, via `lint-staged` on commit, and in CI. Run `pnpm lint` before shipping.

Version bumps use `pnpm bump-version <version>` (no `v` prefix on tags — configured via `--tag-version-prefix=''`).

## Environment variables (Vite, `VITE_*`)

- `VITE_DRACOR_API` — base URL of the DraCor API. If unset in dev, the app relies on the Vite proxy at `/api/v1`.
- `VITE_SITEMAP_URL` — remote sitemap JSON; falls back to bundled [src/sitemap.ts](src/sitemap.ts).
- `VITE_SPARQL_URL`, `VITE_WITH_SPARQL=yes` — SPARQL endpoint + gate for lazy-loading the YASGUI SPARQL UI (`SparqlPlaceholder` is loaded otherwise).
- `VITE_DRACOR_LEGACY_API` — when set, mounts a second APIDoc route at `/doc/legacy/api`.
- `VITE_DRACOR_GUIDELINES`, `VITE_EZLINAVIS_URL`, `VITE_WITH_RAHTZ_PRIZE`.
- `VITE_VERSION` is injected by [version.sh](version.sh) during `start`/`build`/`serve` and shown in the UI.

The Docker image (see [Dockerfile](Dockerfile) + [nginx.conf](nginx.conf)) uses runtime env vars `DRACOR_API_HOST`, `DRACOR_API_PREFIX`, `NGINX_RESOLVER` — nginx reverse-proxies `/api/v1` to the configured backend, so the built frontend just calls `/api/v1` regardless of deployment target.

## Architecture

Single-page React app (React 18, react-router-dom v6) bootstrapped by Vite. Entry: [src/index.tsx](src/index.tsx) → [src/App.tsx](src/App.tsx).

**Routing** ([src/App.tsx](src/App.tsx)) is corpus-driven: `/` (Home), `/:corpusId` (Corpus index), `/:corpusId/:playId` (Play), plus `/doc/:slug`, `/doc/api`, `/doc/odd`, `/doc/corpora`, `/sparql`. The SPARQL UI is code-split via `React.lazy` and only loads the real YASGUI bundle when `VITE_WITH_SPARQL=yes`.

**Global state** is a single React context [DracorContext](src/context.ts) populated once in `App` after fetching `/info` and `/corpora` from the API. Components consume it with `useContext(DracorContext)`; there is no Redux/Zustand.

**API layer** is a thin [apisauce](https://github.com/infinitered/apisauce) client in [src/api.ts](src/api.ts) using `apiUrl` from [src/config.ts](src/config.ts). All backend calls go through it — the base URL is either `VITE_DRACOR_API` or (in dev/prod-behind-nginx) the relative `/api/v1` proxy.

**Types** live in [src/types.ts](src/types.ts) (`Play`, `PlayMetrics`, `Author`, `Character`, `Relation`, `Segment`, `Sitemap`, `ApiInfo`, `DracorContext`). New TS components should reuse these rather than inventing overlapping shapes.

**Mixed JS/TS**. Many components are still `.jsx` (`Play`, `NetworkGraph`, `RelationsGraph`, `Corpus`, `Header`, `TopNav`, etc.). Newer files are `.tsx`. When touching a `.jsx` file, don't do a wholesale rewrite to TypeScript unless the task calls for it.

**Styling** uses Bootstrap 4 + reactstrap for layout, with per-component SCSS via CSS Modules (`Foo.module.scss` → `import styles from './Foo.module.scss'`) alongside a few plain `.scss` files for globals. Global styles are in [src/index.scss](src/index.scss).

**Notable visualizations & viewers**:
- [components/NetworkGraph.jsx](src/components/NetworkGraph.jsx), [components/RelationsGraph.jsx](src/components/RelationsGraph.jsx) — react-sigma character network + relations graphs.
- [components/SpeechDistribution/](src/components/SpeechDistribution/) — three chart variants (`Sapogov`, `TrilckeFischer`, `Yarkho`) rendered via chart.js/recharts.
- [components/TEIPanel.jsx](src/components/TEIPanel.jsx) — renders TEI XML in-browser via CETEIcean.
- [components/SparqlUi.jsx](src/components/SparqlUi.jsx) — YASGUI-backed SPARQL editor (lazy).
- [components/APIDoc.jsx](src/components/APIDoc.jsx), [components/OddPage.jsx](src/components/OddPage.jsx) — swagger-ui-react + ODD/TEI docs viewer.
- [components/CorpusRegistry.tsx](src/components/CorpusRegistry.tsx) — pulls corpus metadata from `@dracor/registry`.

**Docs pages**: markdown in [src/docs/](src/docs/) is rendered by [components/DocPage.tsx](src/components/DocPage.tsx) using `react-markdown` + `rehype-raw`.

## Planned migration

The repo is scheduled for a substantial rework — when touching code, prefer patterns compatible with the target stack over doubling down on the current one:

- **Bootstrap 4 / reactstrap → Tailwind CSS** with the [@dracor/react](https://www.npmjs.com/package/@dracor/react) component library. Avoid adding new reactstrap components or SCSS modules if a Tailwind/`@dracor/react` equivalent will replace them.
- **JS → TypeScript**. New files should be `.tsx`/`.ts`; when meaningfully editing a `.jsx` file, converting it is welcome (but not mandatory for small fixes).
- **react-router-dom v6 → TanStack Router**, likely with route loaders. Keep route-level data fetching self-contained so migration is straightforward.
- **apisauce → native `fetch`**. New API calls can use `fetch` directly rather than extending [src/api.ts](src/api.ts).

Confirm with the user before large, migration-flavored refactors — the migration itself is a separate effort, not a side effect of unrelated tasks.

## Conventions

- ESLint config ([eslint.config.mjs](eslint.config.mjs)) enables `@eslint/js`, `typescript-eslint`, React (jsx-runtime), and Prettier. `no-console` is a warning — existing code uses `// eslint-disable-next-line no-console` for intentional logs; keep that pattern.
- Prettier + `lint-staged` run on commit via Husky (`.husky/`). Formatting is enforced through ESLint's Prettier plugin, so run `pnpm lint` before shipping.
- Path aliases: none — use relative imports.
- Tests co-located as `*.test.ts(x)` next to source; only [src/App.test.tsx](src/App.test.tsx) exists today.
