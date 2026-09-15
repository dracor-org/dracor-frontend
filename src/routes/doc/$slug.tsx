import {createFileRoute} from '@tanstack/react-router';
import {DocPage} from '@dracor/react';
import rehypeRaw from 'rehype-raw';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const Route = createFileRoute('/doc/$slug')({
  component: DocRoute,
});

function DocRoute() {
  const {slug} = Route.useParams();
  return (
    <div className="container-fluid">
      <div className="dracor-page">
        <DocPage
          url={`/doc/${slug}.md`}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({children}) => (
              <Header>
                <h1 className="col">{children}</h1>
              </Header>
            ),
          }}
        />
        <Footer />
      </div>
    </div>
  );
}
