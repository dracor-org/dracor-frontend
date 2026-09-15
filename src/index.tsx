import {createRoot} from 'react-dom/client';
import {createRouter, RouterProvider} from '@tanstack/react-router';
import 'bootstrap/dist/css/bootstrap.css';
import './index.scss';
import './icons';
import {routeTree} from './routeTree.gen';
import {migrateLegacyHash} from './hashRedirect';

// Rewrite legacy #tab bookmarks before the router boots, so the router picks
// up the canonical path immediately.
const rewrite = migrateLegacyHash();
if (rewrite) {
  window.history.replaceState(null, '', rewrite);
}

const router = createRouter({routeTree});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<RouterProvider router={router} />);
