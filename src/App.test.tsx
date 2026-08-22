import {render, screen} from '@testing-library/react';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import TopNav from './components/TopNav';

// Standalone router harness rendering just TopNav — matches the pre-Phase-1
// smoke test which asserted the GitHub link is in the document.
test('renders DraCor GitHub link', async () => {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <TopNav sitemap={[]} />
        <Outlet />
      </>
    ),
  });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({initialEntries: ['/']}),
  });
  render(<RouterProvider router={router} />);
  const link = await screen.findByText(/DraCor GitHub/);
  expect(link).toBeInTheDocument();
});
