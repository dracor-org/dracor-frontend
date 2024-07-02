import React from 'react';
import PropTypes from 'prop-types';
// we need to require from react-sigma/lib/ to make build work
import {
  Sigma,
  EdgeShapes,
  NodeShapes,
  ForceAtlas2,
  RandomizeNodePositions,
} from 'react-sigma/lib/';

const Graph = ({graph, settings, edgeShape}) => {
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
        <EdgeShapes default={edgeShape} />
        <NodeShapes default="circle" />
        <RandomizeNodePositions>{layout}</RandomizeNodePositions>
      </Sigma>
    );
  }

  return sigma;
};

Graph.propTypes = {
  graph: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    edges: PropTypes.array.isRequired,
  }).isRequired,
  settings: PropTypes.object.isRequired,
  edgeShape: PropTypes.string.isRequired,
};

export default Graph;
