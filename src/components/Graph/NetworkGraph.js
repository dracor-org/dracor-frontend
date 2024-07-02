import React from 'react';
import PropTypes from 'prop-types';
import {makeGraph} from '../../network';

import Graph from './Graph';

const NetworkGraph = ({characters, play}) => {
  const graph = makeGraph(characters, play, 'cooccurence');

  const settings = {
    maxEdgeSize: 5,
    defaultLabelSize: 15,
    defaultEdgeColor: '#61affe65', // FIXME: this does not seem to work
    defaultNodeColor: '#61affe',
    labelThreshold: 5,
    labelSize: 'fixed',
    drawLabels: true,
    mouseWheelEnabled: false,
    drawEdges: true,
  };

  return <Graph graph={graph} settings={settings} edgeShape="line" />;
};

NetworkGraph.propTypes = {
  characters: PropTypes.array.isRequired,
  play: PropTypes.shape({
    relations: PropTypes.array.isRequired,
    segments: PropTypes.array.isRequired,
  }).isRequired,
};

export default NetworkGraph;
