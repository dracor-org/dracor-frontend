import {useEffect} from 'react';
import Graph from 'graphology';
import {SigmaContainer, useLoadGraph} from '@react-sigma/core';
import {useWorkerLayoutForceAtlas2} from '@react-sigma/layout-forceatlas2';
import EdgeCurveProgram, {EdgeCurvedArrowProgram} from '@sigma/edge-curve';
import '@react-sigma/core/lib/style.css';
import type {Play} from '../types';

interface Props {
  play: Play;
  nodeColor: string;
  edgeColor: string;
}

/* eslint-disable camelcase */
const edgeColors: Record<string, string> = {
  parent_of: '#6f42c1',
  lover_of: '#f93e3e',
  related_with: '#fca130',
  associated_with: '#61affe',
  siblings: '#49cc90',
  spouses: '#e83e8c',
  friends: '#1F2448',
};
/* eslint-enable camelcase */

const LAYOUT_SETTINGS = {
  gravity: 3,
  slowDown: 5,
  linLogMode: true,
  edgeWeightInfluence: 0,
  adjustSizes: false,
  outboundAttractionDistribution: false,
  strongGravityMode: true,
};

function GraphLoader({play, nodeColor, edgeColor}: Props) {
  const loadGraph = useLoadGraph();
  const {start, kill} = useWorkerLayoutForceAtlas2({
    settings: LAYOUT_SETTINGS,
  });

  useEffect(() => {
    const g = new Graph({multi: true, type: 'directed'});
    play.characters.forEach((c) => {
      g.addNode(c.id, {
        label: c.name || `#${c.id}`,
        color: nodeColor,
        size: 5,
        x: Math.random(),
        y: Math.random(),
      });
    });
    (play.relations || []).forEach((r, i) => {
      if (!g.hasNode(r.source) || !g.hasNode(r.target)) return;
      g.addEdgeWithKey(String(i), r.source, r.target, {
        label: r.type,
        color: edgeColors[r.type] || edgeColor,
        type: r.directed ? 'curvedArrow' : 'curve',
      });
    });
    loadGraph(g);
    start();
    const timeout = window.setTimeout(() => kill(), 2000);
    return () => {
      window.clearTimeout(timeout);
      kill();
    };
  }, [play, nodeColor, edgeColor, loadGraph, start, kill]);

  return null;
}

export default function RelationsGraph({play, nodeColor, edgeColor}: Props) {
  if (!play.characters?.length) return null;

  return (
    <SigmaContainer
      style={{display: 'flex', flexGrow: 1}}
      settings={{
        defaultNodeColor: nodeColor,
        defaultEdgeColor: edgeColor,
        edgeProgramClasses: {
          curve: EdgeCurveProgram,
          curvedArrow: EdgeCurvedArrowProgram,
        },
        renderLabels: true,
        renderEdgeLabels: true,
        labelRenderedSizeThreshold: 3,
        labelSize: 14,
        edgeLabelSize: 12,
        minEdgeThickness: 2,
      }}
    >
      <GraphLoader play={play} nodeColor={nodeColor} edgeColor={edgeColor} />
    </SigmaContainer>
  );
}
