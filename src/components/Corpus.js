import React, {useState, useEffect, useContext} from 'react';
import {Route} from 'react-router-dom';
import {Container} from 'reactstrap';
import {DracorContext} from '../context';
import api from '../api';
import CorpusIndex from './CorpusIndex';
import Play from './Play';
import Header from './Header';
import Footer from './Footer';

const PlayPage = ({match}) => (
  <div style={{height: '100%'}}>
    <Play {...match.params}/>
  </div>
);

const Corpus = ({match, location}) => {
  const {corpusId} = match.params;
  const [corpus, setCorpus] = useState(null);
  const {corpora} = useContext(DracorContext);
  const validCorpus = corpora.filter(c => c.name === corpusId).length === 1;

  useEffect(() => {
    async function fetchCorpus () {
      console.log('fetching corpus...');
      try {
        const response = await api.get(`/corpora/${corpusId}`);
        response.data.dramas.forEach(d => {
          d.networkSize = Number.parseInt(d.networkSize, 10) || 0;
          if (d.authors) {
            d.authorNames = d.authors.map(a => a.name).join(' · ');
          } else {
            d.authors = [];
            d.authorNames = 'Anonymous';
          }
        });
        setCorpus(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    if (validCorpus) {
      fetchCorpus();
    }
  }, [corpusId, validCorpus]);

  if (!validCorpus) {
    return <p className="loading">No such corpus <em>{corpusId}</em>.</p>;
  }

  if (!corpus) {
    return <p className="loading">Loading...</p>;
  }

  if (match.url === location.pathname) {
    return (
      <Container fluid>
        <div className="dracor-page">
          <Header>{corpus.title}</Header>
          <CorpusIndex data={corpus}/>
          <Footer/>
        </div>
      </Container>
    );
  }

  return <Route path={`${match.path}/:playId`} component={PlayPage}/>;
};

export default Corpus;
