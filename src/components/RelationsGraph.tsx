import {useEffect, useMemo} from 'react';
import Graph from 'graphology';
import {DEFAULT_STYLES} from 'sigma';
import {
  extremityArrow,
  layerPlain,
  pathCurved,
  pathLoop,
} from 'sigma/rendering';
import {SigmaContainer, useLoadGraph} from '@react-sigma/core';
import {useWorkerLayoutForceAtlas2} from '@react-sigma/layout-forceatlas2';
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
  // See the note in NetworkGraph: `kill` is terminal and makes the next
  // `start()` throw. The hook kills the supervisor on unmount anyway.
  const {start, stop} = useWorkerLayoutForceAtlas2({
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
        directed: Boolean(r.directed),
      });
    });
    loadGraph(g);
    start();
    // Let the layout settle, then stop burning CPU on it.
    const timeout = window.setTimeout(() => stop(), 2000);
    return () => {
      window.clearTimeout(timeout);
      stop();
    };
  }, [play, nodeColor, edgeColor, loadGraph, start, stop]);

  return null;
}

export default function RelationsGraph({play, nodeColor, edgeColor}: Props) {
  // SigmaContainer rebuilds the renderer whenever its options change, so
  // keep them stable across renders.
  const options = useMemo(
    () => ({
      primitives: {
        edges: {
          // Sigma 4 spreads parallel edges (several relations between the
          // same two characters) on its own.
          paths: [pathCurved(), pathLoop()],
          extremities: [extremityArrow()],
          layers: [layerPlain()],
        },
      },
      // Passing `styles.nodes` / `styles.edges` replaces sigma's defaults
      // rather than extending them, so layer our overrides on top.
      styles: {
        nodes: [
          DEFAULT_STYLES.nodes,
          {
            color: {attribute: 'color', defaultValue: nodeColor},
            labelSize: 14,
          },
        ],
        edges: [
          DEFAULT_STYLES.edges,
          {
            path: 'curved',
            // `pathCurved` draws straight lines unless told otherwise (and
            // ignores its own `curvature` option), so set it per edge. 0.25
            // matches @sigma/edge-curve; sigma overrides it for parallel
            // edges to fan them out.
            curvature: 0.25,
            color: {attribute: 'color', defaultValue: edgeColor},
            labelSize: 12,
            // Sigma 4 centres edge labels on the edge by default.
            labelPosition: 'above' as const,
          },
          {whenData: {directed: true}, then: {head: 'arrow'}},
        ],
      },
      settings: {
        // Sigma 4 reads sizes in graph coordinates by default; keep sizing
        // them in pixels.
        itemSizesReference: 'screen' as const,
        renderLabels: true,
        renderEdgeLabels: true,
        labelRenderedSizeThreshold: 3,
        minEdgeThickness: 2,
      },
    }),
    [nodeColor, edgeColor]
  );

  if (!play.characters?.length) return null;

  return (
    <SigmaContainer style={{display: 'flex', flexGrow: 1}} options={options}>
      <GraphLoader play={play} nodeColor={nodeColor} edgeColor={edgeColor} />
    </SigmaContainer>
  );
}
