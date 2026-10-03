import {Suspense} from 'react';
import {createRootRoute, HeadContent, Outlet} from '@tanstack/react-router';
import {DracorContext} from '../context';
import {sitemapUrl} from '../config';
import defaultSitemap from '../sitemap';
import {fetchApiInfo, fetchCorpora, fetchSitemap} from '../loaders';
import TopNav from '../components/TopNav';
import RouteProgress from '../components/RouteProgress';
import AppSkeleton from '../components/AppSkeleton';

export const Route = createRootRoute({
  loader: async () => {
    const [apiInfo, corpora, sitemap] = await Promise.all([
      fetchApiInfo().catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load API info:', error);
        return undefined;
      }),
      fetchCorpora().catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load corpora:', error);
        return [];
      }),
      sitemapUrl
        ? fetchSitemap(sitemapUrl).catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to load sitemap:', error);
            return defaultSitemap;
          })
        : Promise.resolve(defaultSitemap),
    ]);
    return {apiInfo, corpora, sitemap};
  },
  // The shell can't render until `/info` and `/corpora` resolve, which is
  // long enough to look broken. `pendingMs: 0` shows the skeleton straight
  // away instead of after the 1s default; `pendingMinMs` keeps it from
  // flashing when the API answers quickly.
  pendingMs: 0,
  pendingMinMs: 300,
  pendingComponent: AppSkeleton,
  component: RootComponent,
});

function RootComponent() {
  const {apiInfo, corpora, sitemap} = Route.useLoaderData();

  return (
    <DracorContext value={{corpora: corpora as never[], apiInfo, sitemap}}>
      <HeadContent />
      <div className="d-flex flex-column" style={{height: '100%'}}>
        <TopNav sitemap={sitemap} />
        <RouteProgress />
        <Suspense fallback={<p className="loading">Loading…</p>}>
          <Outlet />
        </Suspense>
      </div>
    </DracorContext>
  );
}
