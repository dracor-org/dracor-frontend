import React, {Component} from 'react';
import PropTypes from 'prop-types';

const jsnx = require('jsnetworkx/jsnetworkx.js');

function round (n) {
  return Math.round(n * 100) / 100;
}

class PlayMetrics extends Component {
  componentWillMount () {
    const {graph} = this.props;
    const G = new jsnx.Graph();
    G.addNodesFrom(graph.nodes.map(n => n.id));
    G.addEdgesFrom(graph.edges.map(e => [e.source, e.target]));
    const paths = jsnx.shortestPathLength(G);
    const density = jsnx.density(G);
    let diameter = 0;
    let sum = 0;
    let numPairs = 0;
    for (const x of paths.entries()) {
      for (const y of x[1].entries()) {
        const l = y[1];
        sum += l;
        if (x[0] !== y[0]) {
          numPairs++;
        }
        if (l > diameter) {
          diameter += l;
        }
      }
    }
    this.setState({
      density,
      diameter,
      averagePathLength: sum / numPairs
    });
  }

  render () {
    const {data, graph} = this.props;
    const {density, diameter, averagePathLength} = this.state;

    const csvUrl = `/api/corpus/${data.corpus}/play/${data.id}/networkdata/csv`;

    const numNodes = graph.nodes.length;

    const allInPercentage = Math.round(data.allInIndex * 100);

    return (
      <div>
        Segments: {data.segments.length}
        <br/>
        All-in at segment {data.allInSegment + ' '}
        (at {allInPercentage}%)
        <br/>
        <span title="number of characters">Network size</span>: {numNodes}
        <br/>
        Density: {round(density)}
        <br/>
        Diameter: {diameter}
        <br/>
        Average path length: {round(averagePathLength)}
        <br/>
        <a href={csvUrl} download={`${data.id}.csv`}>
          Download CSV
        </a>
      </div>
    );
  }
}

PlayMetrics.propTypes = {
  data: PropTypes.object.isRequired,
  graph: PropTypes.object.isRequired
};

export default PlayMetrics;
