import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import classnames from 'classnames';
import api from '../api';
import IdLink from './IdLink';
import Years from './Years';
import CastList from './CastList';
import NetworkGraph from './NetworkGraph';
import RelationsGraph from './RelationsGraph';
import SpeechDistribution from './SpeechDistribution';
import TEIPanel from './TEIPanel';

import './Play.css';

const apiUrl = api.getBaseURL();

const edgeColor = '#61affe65';
const nodeColor = '#61affe';

const tabNames = ['network', 'speech', 'text', 'relations'];

function getCooccurrences (segments) {
  const map = {};
  segments.forEach(s => {
    if (!s.speakers) {
      return;
    }

    // make sure each speaker occurs only once in scene
    const speakers = s.speakers.filter((v, i, a) => a.indexOf(v) === i);
    speakers.forEach((c, i) => {
      if (i < speakers.length - 1) {
        const others = speakers.slice(i + 1);
        others.forEach(o => {
          const pair = [c, o].sort();
          const key = pair.join('|');
          if (map[key]) {
            map[key][2]++;
          } else {
            map[key] = pair.concat(1);
          }
        });
      }
    });
  });

  const cooccurrences = [];
  Object.keys(map)
    .sort()
    .forEach(key => {
      cooccurrences.push(map[key]);
    });

  return cooccurrences;
}

function makeGraph (cast, segments) {
  const nodes = [];
  cast.forEach(p => {
    nodes.push({id: p.id, label: p.name || `#${p.id}`});
  });
  const cooccurrences = getCooccurrences(segments);
  const edges = [];
  cooccurrences.forEach(cooc => {
    edges.push({
      id: cooc[0] + '|' + cooc[1],
      source: cooc[0],
      target: cooc[1],
      size: cooc[2],
      // NB: we set the edge color here since the defaultEdgeColor in Sigma
      // settings does not to have any effect
      color: edgeColor
    });
  });
  return {nodes, edges};
}

// TODO: refactor to reduce complexity
// see https://eslint.org/docs/rules/complexity
/* eslint "complexity": ["error", 30] */

const PlayInfo = ({corpusId, playId}) => {
  const [play, setPlay] = useState(null);
  const [graph, setGraph] = useState(null);
  const [error, setError] = useState(null);
  const [box, setBox] = useState('cast');

  useEffect(() => {
    async function fetchPlay () {
      setError(null);
      const url = `/corpora/${corpusId}/play/${playId}`;
      console.log('loading play %s ...', url);
      try {
        const response = await api.get(url);
        if (response.ok) {
          const {cast, segments} = response.data;
          const graph = makeGraph(cast, segments);
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

  function toggle (b) {
    setBox(b === box ? null : b);
    console.log(box);
  }

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
    tabNames.indexOf(tab) === -1 ||
    (tab === 'relations' && !play.relations)
  ) {
    tab = 'network';
  }

  const playUrl = `${apiUrl}/corpora/${play.corpus}/play/${play.name}`;
  const csvUrl = `${playUrl}/networkdata/csv`;
  const gexfUrl = `${playUrl}/networkdata/gexf`;
  const graphmlUrl = `${playUrl}/networkdata/graphml`;
  const csvRelationsUrl = `${playUrl}/relations/csv`;
  const gexfRelationsUrl = `${playUrl}/relations/gexf`;
  const teiUrl = `${playUrl}/tei`;

  let tabContent = null;
  if (tab === 'speech') {
    tabContent = <SpeechDistribution segments={play.segments} {...{groups}}/>;
  } else if (tab === 'text') {
    tabContent = <TEIPanel url={teiUrl}/>;
  } else if (tab === 'relations') {
    tabContent = <RelationsGraph {...{play, nodeColor, edgeColor}}/>;
  } else {
    tabContent = <NetworkGraph {...{graph, nodeColor, edgeColor, play}}/>;
  }

  const authors = play.authors.map(a => a.name).join(' · ');

  return (
    <div className="h-100 d-md-flex flex-md-column">
      <Helmet titleTemplate="%s - DraCor">
        <title>{`${authors}: ${play.title}`}</title>
      </Helmet>
      <div className="play-header" id="play-header">
        <ul className="play-title">
          <li>
            <h1>{play.title}</h1>
          </li>
          {play.subtitle && (
            <li className="subtitle"><em>{play.subtitle}</em></li>
          )}
          <li className="years mt-2">
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
          </li>
        </ul>
        <ul className="play-meta">
          {play.authors.map(a => (
            <li key={a.key} className="data-link-label" id="play-author">
              {a.name}{' '}
              {a.key && <IdLink>{a.key}</IdLink>}
            </li>
          ))}
          <br/>
          {play.source && (
            <li>
              Source:{' '}
              {play.source.url
                ? <a target="_blank" rel="noopener noreferrer" href={play.source.url}>{play.source.name}</a>
                : play.source.name
              }
            </li>
          )}

          {play.originalSource && (
            <li>
              Original Source:{' '}
              {play.originalSource}
            </li>
          )}
          <li>DraCor: <em>{play.id}</em></li>
          <li className="play-downloads">
            Downloads:
            {' '}
            <span
              className="play-downloads-item"
              onClick={() => toggle('nd-formats')}
            >
              <i>network&nbsp;data</i>
              {box === 'nd-formats' && (
                <span className="formats">
                  <a href={csvUrl} download={`${play.id}-${play.name}.csv`}>
                    CSV
                  </a>
                  <a href={gexfUrl} download={`${play.id}-${play.name}.gexf`}>
                    GEXF
                  </a>
                  <a
                    href={graphmlUrl}
                    download={`${play.id}-${play.name}.graphml`}
                  >
                    GraphML
                  </a>
                </span>)
              }
            </span>
            {' '}
            <span
              className="play-downloads-item"
              onClick={() => toggle('rd-formats')}
            >
              <i>relation&nbsp;data</i>
              {box === 'rd-formats' && (
                <span className="formats">
                  <a
                    href={csvRelationsUrl}
                    download={`${play.id}-${play.name}-relations.csv`}
                  >
                    CSV
                  </a>
                  <a
                    href={gexfRelationsUrl}
                    download={`${play.id}-${play.name}-relations.gexf`}
                  >
                    GEXF
                  </a>
                </span>)
              }
            </span>
            {' '}
            <span
              className="play-downloads-item"
              onClick={() => toggle('st-formats')}
            >
              <i>spoken&nbsp;text</i>
              {box === 'st-formats' && (
                <span className="formats">
                  <a
                    href={`${playUrl}/spoken-text`}
                    download={`${play.id}-${play.name}-spoken.txt`}
                  >
                    TXT
                  </a>
                </span>)
              }
            </span>
            {' '}
            <span
              className="play-downloads-item"
              onClick={() => toggle('stc-formats')}
            >
              <i>spoken&nbsp;text&nbsp;by&nbsp;character</i>
              {box === 'stc-formats' && (
                <span className="formats">
                  <a
                    href={`${playUrl}/spoken-text-by-character.json`}
                    download={`${play.id}-${play.name}-spoken.json`}
                  >
                    JSON
                  </a>
                </span>)
              }
            </span>
            {' '}
            <span
              className="play-downloads-item"
              onClick={() => toggle('sd-formats')}
            >
              <i>stage&nbsp;directions</i>
              {box === 'sd-formats' && (
                <span className="formats">
                  <a
                    target="_blank" rel="noopener noreferrer"
                    href={`${playUrl}/stage-directions`}
                    download={`${play.id}-${play.name}-stage.txt`}
                  >
                    TXT
                  </a>
                </span>
              )}
            </span>
          </li>
        </ul>
        <div className="fullwidth">
          <Nav tabs className="dashboard-tabs">
            <NavItem>
              <NavLink
                href="#network"
                className={classnames({active: tab === 'network'})}
              >
                Network
              </NavLink>
            </NavItem>
            {play.relations && (
              <NavItem>
                <NavLink
                  href="#relations"
                  className={classnames({active: tab === 'relations'})}
                >
                  Relations
                </NavLink>
              </NavItem>
            )}
            <NavItem>
              <NavLink
                href="#speech"
                className={classnames({active: tab === 'speech'})}
              >
                Speech distribution
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#text"
                className={classnames({active: tab === 'text'})}
              >
                Full text
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </div>

      <div className="d-md-flex" style={{flexGrow: 1}}>

        {/* tabbed area */}
        <div
          id="dashboard"
          style={{flex: 1}}
        >
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
