import {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import {Container} from 'reactstrap';
import {DracorContext} from '../context';
import api from '../api';
import CorpusIndex from './CorpusIndex';
import Header from './Header';
import Footer from './Footer';

const Corpus = () => {
  const {corpusId} = useParams();
  const [corpus, setCorpus] = useState(null);
  const [loading, setLoading] = useState(false);
  const {corpora} = useContext(DracorContext);
  const validCorpus = corpora.filter((c) => c.name === corpusId).length === 1;

  useEffect(() => {
    async function fetchCorpus() {
      setLoading(true);
      try {
        const response = await api.get(`/corpora/${corpusId}`);
        response.data.plays.forEach((d) => {
          d.networkSize = Number.parseInt(d.networkSize, 10) || 0;
          if (d.authors) {
            d.authorNames = d.authors.map((a) => a.name).join(' · ');
          } else {
            d.authors = [];
            d.authorNames = 'Anonymous';
          }
        });
        setCorpus(response.data);
        setLoading(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setLoading(false);
      }
    }

    if (validCorpus) {
      fetchCorpus();
    }
  }, [corpusId, validCorpus]);

  if (!validCorpus) {
    return (
      <p className="loading">
        No such corpus <em>{corpusId}</em>.
      </p>
    );
  }

  if (loading || !corpus) {
    return <p className="loading">Loading...</p>;
  }

  if (!loading && corpus) {
    return (
      <Container fluid>
        <div className="dracor-page">
          <Header>{corpus.title}</Header>
          <CorpusIndex data={corpus} />
          <Footer />
        </div>
      </Container>
    );
  }
};

export default Corpus;
