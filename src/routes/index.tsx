import {createFileRoute} from '@tanstack/react-router';
import {sitemapUrl} from '../config';
import {fetchCorpora} from '../loaders';
import Corpora from '../components/Corpora';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const Route = createFileRoute('/')({
  loader: () => fetchCorpora(true),
  component: HomeRoute,
});

function HomeRoute() {
  const data = Route.useLoaderData();
  return (
    <>
      <title>Home - DraCor</title>
      <div className="container-fluid" style={{zIndex: 1}}>
        <Header>DraCor - Open Infrastructure for Drama Analysis</Header>
      </div>
      <Corpora data={data} />
      <div className="container-fluid">
        <Footer withSitemap={!!sitemapUrl} />
      </div>
    </>
  );
}
