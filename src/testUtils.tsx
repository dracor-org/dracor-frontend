import {render} from '@testing-library/react';
import {
  createMemoryHistory,
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
