import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {makeGraph} from '../network';
// we need to require from react-sigma/lib/ to make build work
import {
  Sigma,
  EdgeShapes,
  NodeShapes,
  ForceAtlas2,
  RandomizeNodePositions,
} from 'react-sigma/lib/';

class NetworkGraph extends Component {
  render() {
    const {characters, play, nodeColor, edgeColor} = this.props;

    const graph = makeGraph(characters, play, edgeColor, 'cooccurence');

    const settings = {
      maxEdgeSize: 5,
      defaultLabelSize: 15,
      defaultEdgeColor: edgeColor, // FIXME: this does not seem to work
      defaultNodeColor: nodeColor,
      labelThreshold: 5,
      labelSize: 'fixed',
      drawLabels: true,
      mouseWheelEnabled: false,
      drawEdges: true,
    };

    const layoutOptions = {
      iterationsPerRender: 40,
      edgeWeightInfluence: 0,
      timeout: 2000,
      adjustSizes: false,
      gravity: 3,
      slowDown: 5,
      linLogMode: true,
      outboundAttractionDistribution: false,
      strongGravityMode: false,
    };

    const layout = <ForceAtlas2 {...layoutOptions} />;

    let sigma = null;
    if (graph && graph.nodes.length > 0) {
      sigma = (
        <Sigma
          renderer="canvas"
          graph={graph}
          settings={settings}
          style={{display: 'flex', flexGrow: 1}}
        >
          <EdgeShapes default="line" />
          <NodeShapes default="circle" />
          <RandomizeNodePositions>{layout}</RandomizeNodePositions>
        </Sigma>
      );
    }

    return sigma;
  }
}

NetworkGraph.propTypes = {
  characters: PropTypes.array.isRequired,
  play: PropTypes.shape({
    name: PropTypes.string.isRequired,
    corpus: PropTypes.string.isRequired,
    relations: PropTypes.array.isRequired,
    segments: PropTypes.array.isRequired,
  }).isRequired,
  nodeColor: PropTypes.string.isRequired,
  edgeColor: PropTypes.string.isRequired,
};

export default NetworkGraph;
