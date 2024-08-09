import {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {useParams} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {Container, Col} from 'reactstrap';
import axios, { AxiosError } from 'axios';
import rehypeRaw from 'rehype-raw';
import Header from './Header';
import Footer from './Footer';

const DocPage = () => {
  const [markdown, setMarkdown] = useState('');
  const [title, setTitle] = useState('');
  const {slug} = useParams();

  useEffect(() => {
    async function fetchMarkdown() {
      const url = `/doc/${slug}.md`;
      try {
        const response = await axios.get(url);
        if (
          response.status === 200 &&
          response.headers['content-type'].match(/^text\/markdown/)
        ) {
          setMarkdown(response.data);
          const firstLine = response.data
            .replace(/^\s+/, '')
            .split(/(\n|\r|\r\n){2,}/)[0];
          const m = firstLine.match(/^#\s*(.+)/);
          setTitle(m ? m[1] : '...');
        } else {
          setMarkdown('Not Found');
          setTitle('Not Found');
        }
      } catch (error: any) {
        if (error.message === 'Request failed with status code 404') {
          setMarkdown('Not Found');
          setTitle('Not Found');
        } else {
          console.error(error);
        }
      }
    }

    if (slug) {
      fetchMarkdown();
    }
  }, [slug]);

  return (
    <Container fluid>
      <div className="dracor-page">
        <Helmet titleTemplate="%s - DraCor">
          <title>{title}</title>
        </Helmet>
        <ReactMarkdown
          children={markdown}
          components={{
            h1: ({node, children}) => (
              <Header>
                <Col tag="h1">{children}</Col>
              </Header>
            ),
          }}
          rehypePlugins={[rehypeRaw]}
        />
        <Footer />
      </div>
    </Container>
  );
};

export default DocPage;
