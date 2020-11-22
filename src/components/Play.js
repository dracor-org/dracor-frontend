import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import Sticky from 'react-stickynode';
import {Link} from 'react-router-dom';
import api from '../api';
import {makeGraph} from '../network';
import PlayDetailsNav from './PlayDetailsNav';
import IdLink from './IdLink';
import Years from './Years';
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

  let tabContent = null;
  if (tab === 'speech') {
    tabContent = <SpeechDistribution segments={play.segments} {...{groups}}/>;
  } else if (tab === 'downloads') {
    tabContent = <DownloadLinks play={play}/>;
  } else if (tab === 'text') {
    tabContent = <TEIPanel url={teiUrl}/>;
  } else if (tab === 'relations') {
    tabContent = <RelationsGraph {...{play, nodeColor, edgeColor}}/>;
  } else {
    tabContent = <NetworkGraph {...{graph, nodeColor, edgeColor, play}}/>;
  }

  const authors = play.authors.map(a => a.name).join(' · ');

  return (
    <div className="h-100 d-md-flex flex-md-column dracor-page">
      <Helmet titleTemplate="%s - DraCor">
        <title>{`${authors}: ${play.title}`}</title>
      </Helmet>
      <hgroup className="play-header">
        <h1>{play.title}</h1>
        {play.subtitle && (
          <h2 className="subtitle">
            <em>{play.subtitle}</em>
          </h2>
        )}
        <p className="years">
          <Years
            written={play.yearWritten}
            premiere={play.yearPremiered}
            print={play.yearPrinted}
          />
          {play.wikidataId && (
            <span className="data-link-label">
              {' '}
              <IdLink>{`wikidata:${play.wikidataId}`}</IdLink>
            </span>
          )}
        </p>
        <ul className="play-meta">
          {play.source && (
            <li>
              Source:{' '}
              {play.source.url ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={play.source.url}
                >
                  {play.source.name}
                </a>
              ) : (
                play.source.name
              )}
            </li>
          )}

          {play.originalSource && (
            <li>Original Source: {play.originalSource}</li>
          )}
          <li>
            DraCor: <a href={`/id/${play.id}`}>{play.id}</a>
          </li>
        </ul>
      </hgroup>

      <Sticky enabled innerZ={1}>
        <span>
          <Link className="corpus-label" to={`/${play.corpus}`}>
            <h4>
              <span>{play.corpus}</span>DraCor
            </h4>
          </Link>
          <div className="sticky-headings">
            <h1>{play.title}</h1>
            <span>
              {play.authors.map(a => (
                <h3 key={a.key} className="data-link-label">
                  {a.fullname}{' '} {a.key && <IdLink>{a.key}</IdLink>}
                </h3>
              ))}
            </span>
          </div>
        </span>

        <PlayDetailsNav
          items={
            // we remove relations from nav items if none are available for the
            // play
            navItems.filter(item => item.name !== 'relations' || play.relations)
          }
          current={tab}
        />
      </Sticky>

      <div className="dashboard-wrapper">
        {/* tabbed area */}
        <div id="dashboard" style={{flex: 1}}>
          <div className="d-flex">
            <div className="content-wrapper">{tabContent}</div>
            <div className="cast-list-wrapper">
              <h4>Cast list</h4>
              <p>(in order of appearance)</p>
              <CastList cast={play.cast || []}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayInfo;
