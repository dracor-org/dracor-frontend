import React from 'react';
import PropTypes from 'prop-types';
// we need to require from react-sigma/lib/ to make build work
import {
  Sigma,
  EdgeShapes,
  NodeShapes,
  ForceAtlas2,
  RelativeSize,
  RandomizeNodePositions,
} from 'react-sigma/lib/';

/* eslint-disable camelcase */
const edgeColors = {
  parent_of: '#6f42c1', // purple
  lover_of: '#f93e3e', // red
  related_with: '#fca130', // orange
  associated_with: '#61affe', // blue
  siblings: '#49cc90', // green
  spouses: '#e83e8c', // pink
  friends: '#1F2448', // navy
};
/* eslint-enable camelcase */

const RelationsGraph = ({play, nodeColor, edgeColor}) => {
  const nodes = play.characters.map((c) => ({
    id: c.id,
    label: c.name || `#${c.id}`,
  }));
  const edges = (play.relations || []).map((r, i) => ({
    id: i,
    source: r.source,
    target: r.target,
    label: r.type,
    color: edgeColors[r.type] || edgeColor,
    type: r.directed ? 'curvedArrow' : 'curve',
  }));
  const graph = {nodes, edges};

  const settings = {
    maxEdgeSize: 5,
    defaultLabelSize: 14,
    defaultEdgeColor: edgeColor, // FIXME: this does not seem to work
    defaultNodeColor: nodeColor,
    edgeLabelColor: 'edge',
    labelThreshold: 3,
    labelSize: 'fixed',
    drawLabels: true,
    drawEdges: true,
    drawEdgeLabels: true,
    edgeLabelSize: 'proportional',
    minNodeSize: 2,
    minArrowSize: 10,
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
    strongGravityMode: true,
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
        <EdgeShapes default="curvedArrow" />
        <NodeShapes default="circle" />
        <RandomizeNodePositions>
          {layout}
          <RelativeSize initialSize={15} />
        </RandomizeNodePositions>
      </Sigma>
    );
  }

  return sigma;
};

RelationsGraph.propTypes = {
  play: PropTypes.shape({
    characters: PropTypes.array.isRequired,
    relations: PropTypes.array.isRequired,
  }).isRequired,
  nodeColor: PropTypes.string.isRequired,
  edgeColor: PropTypes.string.isRequired,
};

export default RelationsGraph;
