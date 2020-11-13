import React, {useState, useEffect, useContext} from 'react';
import {Route} from 'react-router-dom';
import {DracorContext} from '../context';
import api from '../api';
import CorpusIndex from './CorpusIndex';
import Play from './Play';

function splitAuthorName (name) {
  // just pass through names that already have been split (i.e. having a comma)
  // or are just a single names (e.g. Klabund)
  if (/, /.test(name) || /^[^ ]+$/.test(name)) {
    return name;
  }

  const parts = name.split(' ');
  const last = parts.pop();
  return `${last}, ${parts.join(' ')}`;
}

function splitAuthors (authors) {
  return authors.map(author => splitAuthorName(author.name));
}

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
          d.networkSize = parseInt(d.networkSize, 10) || 0;
          if (d.authors) {
            d.authorNames = splitAuthors(d.authors).join(' · ');
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
      <div className="dracor-page">
        <hgroup>
        <h1>{corpus.title}</h1>
        </hgroup>
        <CorpusIndex data={corpus}/>
      </div>
    );
  }

  return <Route path={`${match.path}/:playId`} component={PlayPage}/>;
};

export default Corpus;
