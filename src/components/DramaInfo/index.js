import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import {Card, CardHeader, CardBody} from 'reactstrap';
import PlayMetrics from '../PlayMetrics';
import CastList from '../CastList';
import NetworkGraph from '../NetworkGraph';

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
    const url = `/api/corpus/${corpusId}/play/${dramaId}`;
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

    return (
      <div className="h-100 d-md-flex flex-md-column">
        <Helmet titleTemplate="%s - Dracor.org">
          <title>{`${data.author.name}: ${data.title}`}</title>
        </Helmet>

        <header>
          <h4>{data.author.name}</h4>
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
              Network
              <a href="#network-metrics" className="float-right d-md-none">
                metrics
              </a>
            </CardHeader>
            <CardBody className="d-flex" style={{minHeight: '50vh'}}>
              <NetworkGraph {...{graph, nodeColor, edgeColor}}/>
            </CardBody>
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
