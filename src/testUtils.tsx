import type {ReactNode} from 'react';
import {render} from '@testing-library/react';
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import {routeTree} from './routeTree.gen';

/**
 * Mount the real route tree at `path` with an in-memory history and wait for
 * the router to finish loading. Returns the router so tests can assert on the
 * resolved location after a `redirect()`.
 */
export async function renderRoute(path: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({initialEntries: [path]}),
  });

  // Run loaders before mounting so the first paint already has data; this
  // keeps assertions free of an initial pending state.
  await router.load();

  const result = render(<RouterProvider router={router as never} />);
  return {...result, router};
}

/**
 * Mount a single component inside a router, for components that render
 * `Link`s but whose behaviour doesn't depend on the surrounding route. Use
 * `renderRoute` whenever the real route tree is what's under test.
 */
export async function renderWithRouter(ui: ReactNode) {
  const router = createRouter({
    routeTree: createRootRoute({component: () => ui}),
    history: createMemoryHistory({initialEntries: ['/']}),
  });

  await router.load();

  return render(<RouterProvider router={router as never} />);
}

/**
 * Mount without awaiting the loaders, so the pending state is observable.
 * Use with a handler that holds its response open.
 */
export function renderRoutePending(path: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({initialEntries: [path]}),
  });
  const result = render(<RouterProvider router={router as never} />);
  return {...result, router};
}
