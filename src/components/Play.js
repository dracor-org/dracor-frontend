import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Container} from 'reactstrap';
import {Helmet} from 'react-helmet';
import api from '../api';
import PlayDetailsHeader from './PlayDetailsHeader';
import PlayDetailsNav from './PlayDetailsNav';
import PlayDetailsTab from './PlayDetailsTab';
import CastList from './CastList';
import SourceInfo from './SourceInfo';
import DownloadLinks from './DownloadLinks';
import NetworkGraph from './Graph/NetworkGraph';
import RelationsGraph from './Graph/RelationsGraph';
import SpeechDistribution, {SpeechDistributionNav} from './SpeechDistribution';
import TEIPanel from './TEIPanel';
import PlayMetrics from './PlayMetrics';
import Segments from './Segments';

import './Play.scss';

const apiUrl = api.getBaseURL();

const navItems = [
  {name: 'network', label: 'Network'},
  {name: 'relations', label: 'Relations'},
  {name: 'speech', label: 'Speech distribution'},
  {name: 'text', label: 'Full text'},
  {name: 'downloads', label: 'Downloads'},
];

const tabNames = new Set(navItems.map((item) => item.name));

const PlayInfo = ({corpusId, playId}) => {
  const [play, setPlay] = useState(null);
  const [characters, setCharacters] = useState(null);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('sapogov');

  useEffect(() => {
    async function fetchPlay() {
      setError(null);
      const url = `/corpora/${corpusId}/plays/${playId}`;
      console.log('loading play %s ...', url);
      try {
        const response = await api.get(url);
        if (response.ok) {
          setPlay(response.data);
        } else if (response.status === 404) {
          setError(new Error('not found'));
        } else {
          setError(response.originalError);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchPlay();
  }, [corpusId, playId]);

  useEffect(() => {
    async function fetchCharacters() {
      setError(null);
      const url = `/corpora/${corpusId}/plays/${playId}/characters`;
      try {
        const response = await api.get(url);
        if (response.ok) {
          setCharacters(response.data);
        } else if (response.status === 404) {
          setError(new Error('not found'));
        } else {
          setError(response.originalError);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchCharacters();
  }, [corpusId, playId]);

  if (error && error.message === 'not found') {
    return <p>No such play!</p>;
  }

  if (error) {
    console.log(error);
    return <p>Error!</p>;
  }

  if (!play || !characters) {
    return <p className="loading">Loading...</p>;
  }

  console.log('PLAY', play);

  const groups = play.characters
    .filter((m) => Boolean(m.isGroup))
    .map((m) => m.id);

  let tab = document.location.hash.replace('#', '');
  if (!tabNames.has(tab) || (tab === 'relations' && !play.relations)) {
    tab = 'network';
  }

  const teiUrl = `${apiUrl}/corpora/${play.corpus}/plays/${play.name}/tei`;

  const castList = <CastList hasTitle characters={play.characters || []} />;

  const playMetrics = <PlayMetrics play={play} />;

  let tabContent = null;
  let description = null;
  let cast = null;
  let metrics = null;
  let segments = null;

  if (tab === 'speech') {
    tabContent = (
      <SpeechDistribution
        type={chartType}
        segments={play.segments}
        {...{groups}}
      />
    );
    description = (
      <SpeechDistributionNav
        type={chartType}
        onChange={(type) => setChartType(type)}
      />
    );
  } else if (tab === 'downloads') {
    tabContent = <DownloadLinks play={play} />;
    description = (
      <p>
        This tab provides download options for different semantic layers of a
        single play in different formats for a closer analysis with appropriate
        tools.
      </p>
    );
  } else if (tab === 'text') {
    tabContent = <TEIPanel url={teiUrl} />;
    description = (
      <SourceInfo source={play.source} original={play.originalSource} />
    );
    segments = <Segments play={play} />;
  } else if (tab === 'relations') {
    tabContent = <RelationsGraph {...{characters, play}} />;
    cast = castList;
    description = (
      <p>
        This tab visualises kinship and other relationship data, following the
        encoding scheme proposed in{' '}
        <a href="https://doi.org/10.5281/zenodo.4621778">
          Wiedmer, Pagel, Reiter 2020
        </a>
        .
      </p>
    );
  } else {
    tabContent = <NetworkGraph {...{characters, play}} />;
    cast = castList;
    metrics = playMetrics;
    description = (
      <p>
        This tab shows a co-occurrence network. If characters appear in the same
        scene or act, they are linked.
      </p>
    );
  }

  const authors = play.authors.map((a) => a.name).join(' · ');

  // we remove relations from nav items if none are available for the play
  const items = navItems.filter(
    (item) => item.name !== 'relations' || play.relations
  );

  return (
    <div className="h-100 d-md-flex flex-md-column dracor-page">
      <Helmet titleTemplate="%s - DraCor">
        <title>{`${authors}: ${play.title}`}</title>
      </Helmet>
      <PlayDetailsHeader play={play}>
        <PlayDetailsNav items={items} current={tab} />
      </PlayDetailsHeader>
      <Container fluid>
        <PlayDetailsTab
          characters={cast}
          description={description}
          metrics={metrics}
          segments={segments}
        >
          {tabContent}
        </PlayDetailsTab>
      </Container>
    </div>
  );
};

PlayInfo.propTypes = {
  corpusId: PropTypes.string,
  playId: PropTypes.string,
};

export default PlayInfo;
