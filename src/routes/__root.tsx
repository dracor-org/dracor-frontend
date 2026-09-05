import {Suspense} from 'react';
import {
  createRootRoute,
  HeadContent,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import {DracorContext} from '../context';
import {sitemapUrl} from '../config';
import defaultSitemap from '../sitemap';
import {fetchApiInfo, fetchCorpora, fetchSitemap} from '../loaders';
import TopNav from '../components/TopNav';

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
  component: RootComponent,
});

function RootComponent() {
  const {apiInfo, corpora, sitemap} = Route.useLoaderData();
  const isLoading = useRouterState({select: (s) => s.isLoading});

  return (
    <DracorContext value={{corpora: corpora as never[], apiInfo, sitemap}}>
      <HeadContent />
      <div className="d-flex flex-column" style={{height: '100%'}}>
        <TopNav sitemap={sitemap} />
        <Suspense fallback={<div>Loading…</div>}>
          {isLoading ? <div /> : null}
          <Outlet />
        </Suspense>
      </div>
    </DracorContext>
  );
}
