import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import api from '../api';
import {makeGraph} from '../network';
import PlayDetailsHeader from './PlayDetailsHeader';
import PlayDetailsNav from './PlayDetailsNav';
import PlayDetailsTab from './PlayDetailsTab';
import CastList from './CastList';
import DownloadLinks from './DownloadLinks';
import NetworkGraph from './NetworkGraph';
import RelationsGraph from './RelationsGraph';
import SpeechDistribution from './SpeechDistribution';
import TEIPanel from './TEIPanel';

import './Play.scss';

const apiUrl = api.getBaseURL();

const edgeColor = '#61affe65';
const nodeColor = '#61affe';

const navItems = [
  {name: 'network', label: 'Network'},
  {name: 'relations', label: 'Relations'},
  {name: 'speech', label: 'Speech distribution'},
  {name: 'text', label: 'Full text'},
  {name: 'downloads', label: 'Downloads'}
  // {name: 'sources', label: 'Sources'}
];

const tabNames = new Set(navItems.map(item => item.name));

const PlayInfo = ({corpusId, playId}) => {
  const [play, setPlay] = useState(null);
  const [graph, setGraph] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlay () {
      setError(null);
      const url = `/corpora/${corpusId}/play/${playId}`;
      console.log('loading play %s ...', url);
      try {
        const response = await api.get(url);
        if (response.ok) {
          const {cast, segments} = response.data;
          const graph = makeGraph(cast, segments, edgeColor);
          setPlay(response.data);
          setGraph(graph);
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

  if (error && error.message === 'not found') {
    return <p>No such play!</p>;
  }

  if (error) {
    console.log(error);
    return <p>Error!</p>;
  }

  if (!play) {
    return <p className="loading">Loading...</p>;
  }

  if (!graph) {
    return <p>No Graph!</p>;
  }

  console.log('PLAY', play);
  console.log('GRAPH', graph);

  const groups = play.cast.filter(m => Boolean(m.isGroup)).map(m => m.id);

  let tab = document.location.hash.replace('#', '');
  if (
    !tabNames.has(tab) ||
    (tab === 'relations' && !play.relations)
  ) {
    tab = 'network';
  }

  const teiUrl = `${apiUrl}/corpora/${play.corpus}/play/${play.name}/tei`;

  const castList = <CastList hasTitle cast={play.cast || []}/>;

  let tabContent = null;
  let sidebar = null;

  if (tab === 'speech') {
    tabContent = <SpeechDistribution segments={play.segments} {...{groups}}/>;
  } else if (tab === 'downloads') {
    tabContent = <DownloadLinks play={play}/>;
  } else if (tab === 'text') {
    tabContent = <TEIPanel url={teiUrl}/>;
  } else if (tab === 'relations') {
    tabContent = <RelationsGraph {...{play, nodeColor, edgeColor}}/>;
    sidebar = castList;
  } else {
    tabContent = <NetworkGraph {...{graph, nodeColor, edgeColor, play}}/>;
    sidebar = castList;
  }

  const authors = play.authors.map(a => a.name).join(' · ');

  // we remove relations from nav items if none are available for the play
  const items = navItems.filter(
    item => item.name !== 'relations' || play.relations
  );

  return (
    <div className="h-100 d-md-flex flex-md-column dracor-page">
      <Helmet titleTemplate="%s - DraCor">
        <title>{`${authors}: ${play.title}`}</title>
      </Helmet>
      <PlayDetailsHeader play={play}/>
      <PlayDetailsNav items={items} current={tab}/>
      <PlayDetailsTab sidebar={sidebar}>
        {tabContent}
      </PlayDetailsTab>
    </div>
  );
};

export default PlayInfo;
