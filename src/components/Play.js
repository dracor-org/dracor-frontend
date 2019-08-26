import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import classnames from 'classnames';
import api from '../api';
import PlayMetrics from './PlayMetrics';
import CastList from './CastList';
import NetworkGraph from './NetworkGraph';
import SpeechDistribution from './SpeechDistribution';

import './Play.css';

const apiUrl = api.getBaseURL();

const edgeColor = '#999';
const nodeColor = '#555';

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

  if (error && error.message === 'not found') {
    return <p>No such play!</p>;
  }

  if (error) {
    console.log(error);
    return <p>Error!</p>;
  }

  if (!play) {
    return <p>Loading...</p>;
  }

  if (!graph) {
    return <p>No Graph!</p>;
  }

  console.log('PLAY', play);
  console.log('GRAPH', graph);

  const groups = play.cast.filter(m => Boolean(m.isGroup)).map(m => m.id);

  let tab = document.location.hash.replace('#', '');
  if (['network', 'speech'].indexOf(tab) === -1) {
    tab = 'network';
  }

  let tabContent = null;
  if (tab === 'speech') {
    tabContent = <SpeechDistribution segments={play.segments} {...{groups}}/>;
  } else {
    tabContent = <NetworkGraph {...{graph, nodeColor, edgeColor}}/>;
  }

  const csvUrl =
    `${apiUrl}/corpora/${play.corpus}/play/${play.name}/networkdata/csv`;
  const gexfUrl =
    `${apiUrl}/corpora/${play.corpus}/play/${play.name}/networkdata/gexf`;

  const authors = play.authors.map(a => a.name).join(' · ');

  return (
    <div className="h-100 d-md-flex flex-md-column">
      <Helmet titleTemplate="%s - DraCor">
        <title>{`${authors}: ${play.title}`}</title>
      </Helmet>

      <header>
        <h4>{authors}</h4>
        <h2>
          {play.title}
          <br/>
          <small>{play.subtitle}</small>
        </h2>
      </header>

      <div className="d-md-flex" style={{flexGrow: 1}}>
        <Card
          id="network-graph"
          className="mb-2 order-2 ml-md-2"
          style={{flex: 1}}
        >
          <CardHeader>
            <Nav tabs className="card-header-tabs">
              <NavItem>
                <NavLink
                  href="#network"
                  className={classnames({active: tab === 'network'})}
                >
                  Network
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#speech"
                  className={classnames({active: tab === 'speech'})}
                >
                  Speech distribution
                </NavLink>
              </NavItem>
            </Nav>
          </CardHeader>
          <CardBody className="d-flex" style={{minHeight: '50vh'}}>
            {tabContent}
          </CardBody>
          <CardFooter className="text-center d-md-none">
            <a href="#network-metrics">metrics</a>
          </CardFooter>
        </Card>

        <div className="d-flex flex-column">
          <Card
            id="cast-list"
            className="mb-2 order-md-2"
            style={{flexGrow: 1}}
          >
            <CardHeader>
              Cast list (in order of appearance)
            </CardHeader>
            <CardBody className="position-relative">
              <div className="cast-list-wrapper px-md-4 my-md-4">
                <CastList cast={play.cast || []}/>
              </div>
            </CardBody>
          </Card>

          <Card
            id="network-metrics"
            className="mb-2 order-md-1"
            style={{flexShrink: 0}}
          >
            <CardHeader>
              Metrics
              {' '}
              <a href="#network-graph" className="float-right d-md-none">
                graph
              </a>
            </CardHeader>
            <CardBody>
              <PlayMetrics play={play}/>
            </CardBody>
            <CardFooter className="text-center">
              <small>
                {'Download network data: '}
                <a href={csvUrl} download={`${play.id}-${play.name}.csv`}>
                  CSV
                </a>
                {' · '}
                <a href={gexfUrl} download={`${play.id}-${play.name}.gexf`}>
                  GEXF
                </a>
              </small>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayInfo;
