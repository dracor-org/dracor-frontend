import {createFileRoute} from '@tanstack/react-router';
import {Helmet} from 'react-helmet';
import {Container} from 'reactstrap';
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
      <Helmet titleTemplate="%s - DraCor">
        <title>Home</title>
      </Helmet>
      <Container fluid style={{zIndex: 1}}>
        <Header>DraCor - Open Infrastructure for Drama Analysis</Header>
      </Container>
      <Corpora data={data} />
      <Container fluid>
        <Footer withSitemap={!!sitemapUrl} />
      </Container>
    </>
  );
}
