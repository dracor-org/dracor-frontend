import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
import PlayMetrics from '../PlayMetrics';
import CastList from '../CastList';
import NetworkGraph from '../NetworkGraph';
import SpeechDistribution from '../SpeechDistribution';

import './index.css';

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

class DramaInfo extends Component {
  constructor (props) {
    super(props);
    console.log(props);
    this.state = {data: null};
  }

  componentWillReceiveProps (next) {
    const {corpusId, dramaId} = this.props;
    if (dramaId !== next.dramaId || corpusId !== next.corpusId) {
      this.load(corpusId, dramaId);
    }
  }

  componentWillMount () {
    const {corpusId, dramaId} = this.props;
    this.load(corpusId, dramaId);
  }

  load (corpusId, dramaId) {
    const url = `/api/corpora/${corpusId}/play/${dramaId}`;
    console.log('loading %s', url);
    fetch(url, {})
      .then(response => {
        return response.json();
      })
      .then(data => {
        const graph = makeGraph(data.cast, data.segments);
        console.log(data);
        console.log(graph);
        this.setState({data, graph});
      })
      .catch(err => {
        console.log('parsing failed', err);
      });
  }

  renderData () {
    const {data, graph} = this.state;
    if (!data) {
      return null;
    }

    const groups = data.cast.filter(m => Boolean(m.isGroup)).map(m => m.id);

    let tab = document.location.hash.replace('#', '');
    if (['network', 'speech'].indexOf(tab) === -1) {
      tab = 'network';
    }
    let tabContent = null;
    if (tab === 'speech') {
      tabContent = <SpeechDistribution segments={data.segments} {...{groups}}/>;
    } else {
      tabContent = <NetworkGraph {...{graph, nodeColor, edgeColor}}/>;
    }

    const csvUrl = `/api/corpora/${data.corpus}/play/${data.id}/networkdata/csv`;
    const gexfUrl = `/api/corpora/${data.corpus}/play/${data.id}/networkdata/gexf`;

    return (
      <div className="h-100 d-md-flex flex-md-column">
        <Helmet titleTemplate="%s - DraCor">
          <title>{`${data.author.name}: ${data.title}`}</title>
        </Helmet>

        <header>
          <h4>{data.authors.map(a => a.name).join(' · ')}</h4>
          <h2>
            {data.title}
            <br/>
            <small>{data.subtitle}</small>
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
                  <CastList cast={data.cast || []}/>
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
                <a href="#network-graph" className="float-right d-md-none">
                  graph
                </a>
              </CardHeader>
              <CardBody>
                <PlayMetrics {...{data, graph}}/>
              </CardBody>
              <CardFooter className="text-center">
                <small>
                  {'Download network data: '}
                  <a href={csvUrl} download={`${data.id}.csv`}>CSV</a>
                  {' · '}
                  <a href={gexfUrl} download={`${data.id}.gexf`}>GEXF</a>
                </small>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  render () {
    const {data} = this.state;
    return data ? this.renderData() : <em>loading...</em>;
  }
}

DramaInfo.propTypes = {
  corpusId: PropTypes.string.isRequired,
  dramaId: PropTypes.string.isRequired
};

export default DramaInfo;
