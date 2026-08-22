import ReactMarkdown from 'react-markdown';
import {Helmet} from 'react-helmet';
import {Container, Col} from 'reactstrap';
import rehypeRaw from 'rehype-raw';
import Header from './Header';
import Footer from './Footer';

interface Props {
  markdown: string;
  title: string;
}

const DocPage = ({markdown, title}: Props) => {
  return (
    <Container fluid>
      <div className="dracor-page">
        <Helmet titleTemplate="%s - DraCor">
          <title>{title}</title>
        </Helmet>
        <ReactMarkdown
          components={{
            h1: ({children}) => (
              <Header>
                <Col tag="h1">{children}</Col>
              </Header>
            ),
          }}
          rehypePlugins={[rehypeRaw]}
        >
          {markdown}
        </ReactMarkdown>
        <Footer />
      </div>
    </Container>
  );
};

export default DocPage;
