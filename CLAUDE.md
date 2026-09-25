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

Single-page React 19 app bootstrapped by Vite. Entry: [src/index.tsx](src/index.tsx) mounts the TanStack Router `RouterProvider`; there is no `App.tsx`.

**Routing** uses TanStack Router with file-based routes under [src/routes/](src/routes/) and a generated [src/routeTree.gen.ts](src/routeTree.gen.ts). The tree: [`__root.tsx`](src/routes/__root.tsx) (global shell + `/info` + `/corpora` loader), [`index.tsx`](src/routes/index.tsx) (Home), [`$corpusId/index.tsx`](src/routes/$corpusId/index.tsx) (Corpus), [`$corpusId/$playId/`](src/routes/$corpusId/$playId/) (Play — `route.tsx` loads the play + metrics, `$tab.tsx` renders the active tab as its own route segment), plus [`doc/$slug.tsx`](src/routes/doc/$slug.tsx), [`doc/api.tsx`](src/routes/doc/api.tsx), [`doc/odd.tsx`](src/routes/doc/odd.tsx), [`doc/corpora.tsx`](src/routes/doc/corpora.tsx), [`doc/legacy.api.tsx`](src/routes/doc/legacy.api.tsx), [`sparql.tsx`](src/routes/sparql.tsx) (lazy — real YASGUI bundle only loads when `VITE_WITH_SPARQL=yes`).

**Global state** is a single React context [DracorContext](src/context.ts) populated by `__root.tsx` via its loader (`/info` + `/corpora`). Components consume it with `use(DracorContext)`.

**API layer** is native `fetch` in [src/loaders.ts](src/loaders.ts). Route loaders call these helpers; components read the result via `Route.useLoaderData()`. The base URL is either `VITE_DRACOR_API` or (in dev / prod-behind-nginx) the relative `/api/v1` proxy — see [src/config.ts](src/config.ts).

**Types** live in [src/types.ts](src/types.ts) (`Play`, `PlayMetrics`, `Author`, `Character`, `Relation`, `Segment`, `Sitemap`, `ApiInfo`, `DracorContext`). New code should reuse these rather than inventing overlapping shapes.

**Styling** is Tailwind CSS v4 + [@dracor/react](https://www.npmjs.com/package/@dracor/react)'s design tokens. [src/index.css](src/index.css) imports `tailwindcss`, `@dracor/react/dracor.css`, and `@dracor/react/tei.css`, plus a small block of local overrides (Rubik webfont, palette aliases, `.dracor-page` gutter, funding-note pills, `.dracor-tabs` bar, `.authors-tinted` portrait tint). Component-local styling is either Tailwind classes inline or a `.module.css` / `.css` next to the component (`PlayDetailsTab.module.css`, `TEIPanel.css`, `Odd.css`, `SparqlUi.css`).

**Notable visualizations & viewers**:
- [components/NetworkGraph.tsx](src/components/NetworkGraph.tsx), [components/RelationsGraph.tsx](src/components/RelationsGraph.tsx) — character network + relations graph via `@react-sigma/core` + `sigma` v3 + `graphology`. Curved edges from `@sigma/edge-curve`, square nodes from `@sigma/node-square`.
- [components/SpeechDistribution/](src/components/SpeechDistribution/) — three chart variants (`Sapogov`, `TrilckeFischer`, `Yarkho`) via chart.js / recharts.
- [components/TEIPanel.tsx](src/components/TEIPanel.tsx) — wraps `TEIText` from `@dracor/react` (which uses CETEIcean under the hood). Adds a scrollable frame with top/bottom gradient fades and the DraCor scrollbar chrome.
- [components/SparqlUi.tsx](src/components/SparqlUi.tsx) — `@zazuko/yasgui`-backed SPARQL editor (lazy).
- [routes/doc/api.tsx](src/routes/doc/api.tsx) — API docs via `ApiDoc` from `@dracor/react` (Scalar-based). [components/Odd.tsx](src/components/Odd.tsx) — ODD / TEI docs viewer.
- [components/CorpusRegistry.tsx](src/components/CorpusRegistry.tsx) — pulls corpus metadata from `@dracor/registry`.

**Docs pages**: markdown in [public/doc/](public/doc/) is fetched at runtime and rendered by `DocPage` from `@dracor/react` (`react-markdown` + `rehype-raw`).

## Conventions

- ESLint config ([eslint.config.mjs](eslint.config.mjs)) enables `@eslint/js`, `typescript-eslint`, React (jsx-runtime), and Prettier. `no-console` is a warning — existing code uses `// eslint-disable-next-line no-console` for intentional logs; keep that pattern.
- Prettier + `lint-staged` run on commit via Husky (`.husky/`). Formatting is enforced through ESLint's Prettier plugin, so run `pnpm lint` before shipping.
- Path aliases: none — use relative imports.
- Tests co-located as `*.test.ts(x)` next to source; only [src/App.test.tsx](src/App.test.tsx) exists today. Route-level smoke tests with MSW ([src/mocks/](src/mocks/)) are on the 3.0.0 punch list.
