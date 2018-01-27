import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
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

    const cast = data.cast || [];
    return (
      <div className="drama-info">
        <Helmet titleTemplate="%s - Dracor.org">
          <title>{`${data.author.name}: ${data.title}`}</title>
        </Helmet>
        <h3>{data.author.name}</h3>
        <h2>
          {data.title}
          <br/>
          <small>{data.subtitle}</small>
        </h2>

        <div className="drama-info__stats">
          <PlayMetrics {...{data, graph}}/>
        </div>

        <div className="drama-info__cols">
          <div className="drama-info__cast">
            <h4>Cast list (in order of appearance)</h4>
            <CastList cast={cast}/>
          </div>
          <div className="drama-info__graph">
            <NetworkGraph {...{graph, nodeColor, edgeColor}}/>
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
