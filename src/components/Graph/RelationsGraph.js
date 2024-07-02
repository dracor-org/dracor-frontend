import React from 'react';
import PropTypes from 'prop-types';
import {makeGraph} from '../../network';
import Graph from './Graph';

const RelationsGraph = ({characters, play}) => {
  const graph = makeGraph(characters, play, 'relation');

  const settings = {
    maxEdgeSize: 5,
    defaultLabelSize: 14,
    defaultEdgeColor: '#61affe65', // FIXME: this does not seem to work
    defaultNodeColor: '#61affe',
    edgeLabelColor: 'edge',
    labelThreshold: 3,
    labelSize: 'fixed',
    drawLabels: true,
    drawEdges: true,
    drawEdgeLabels: true,
    edgeLabelSize: 'proportional',
    minArrowSize: 10,
  };

  return <Graph graph={graph} settings={settings} edgeShape="curvedArrow" />;
};

RelationsGraph.propTypes = {
  characters: PropTypes.array.isRequired,
  play: PropTypes.shape({
    relations: PropTypes.array.isRequired,
    segments: PropTypes.array.isRequired,
  }).isRequired,
};

export default RelationsGraph;
