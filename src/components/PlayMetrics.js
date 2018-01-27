import React, {Component} from 'react';
import PropTypes from 'prop-types';

class PlayMetrics extends Component {
  render () {
    const {data, graph} = this.props;
    const csvUrl = `/api/corpus/${data.corpus}/play/${data.id}/networkdata/csv`;

    // graph density (d = actual edges / possible edges)
    // possible edges = n*(n-1)/2  [n: number f nodes]
    // see https://en.wikipedia.org/wiki/Dense_graph
    const numNodes = graph.nodes.length;
    const numEdges = graph.edges.length;
    const density =
      numNodes > 0
        ? Math.round(2 * numEdges / (numNodes * (numNodes - 1)) * 100) / 100
        : 'n/a';

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
        Density: {density}
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
