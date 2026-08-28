import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Header from './Header';
import Footer from './Footer';

interface Props {
  markdown: string;
  title: string;
}

const DocPage = ({markdown, title}: Props) => {
  return (
    <div className="container-fluid">
      <div className="dracor-page">
        <title>{`${title} - DraCor`}</title>
        <ReactMarkdown
          components={{
            h1: ({children}) => (
              <Header>
                <h1 className="col">{children}</h1>
              </Header>
            ),
          }}
          rehypePlugins={[rehypeRaw]}
        >
          {markdown}
        </ReactMarkdown>
        <Footer />
      </div>
    </div>
  );
};

export default DocPage;
