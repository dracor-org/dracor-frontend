import React, {useState, useEffect, useContext} from 'react';
import {Route} from 'react-router-dom';
import {DracorContext} from '../context';
import api from '../api';
import CorpusIndex from './CorpusIndex';
import DramaInfo from './DramaInfo';

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
    <DramaInfo {...match.params}/>
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
          d.authorNames = splitAuthors(d.authors).join(' · ');
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
    return <p>No such corpus <em>{corpusId}</em>.</p>;
  }

  if (!corpus) {
    return <p>Loading...</p>;
  }

  if (match.url === location.pathname) {
    return (
      <div>
        <h2>{corpus.title}</h2>
        <CorpusIndex data={corpus}/>
      </div>
    );
  }

  return <Route path={`${match.path}/:dramaId`} component={PlayPage}/>;
};

export default Corpus;
