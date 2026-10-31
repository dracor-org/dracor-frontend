import {useEffect, useMemo} from 'react';
import Graph from 'graphology';
import {DEFAULT_STYLES} from 'sigma';
import {layerFill, sdfCircle, sdfSquare} from 'sigma/rendering';
import {SigmaContainer, useLoadGraph} from '@react-sigma/core';
import {useWorkerLayoutForceAtlas2} from '@react-sigma/layout-forceatlas2';
import '@react-sigma/core/lib/style.css';

interface Node {
  id: string;
  label: string;
  color?: string;
  type?: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  size?: number;
  color?: string;
  label?: string;
  type?: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface Props {
  graph: GraphData;
  nodeColor: string;
  edgeColor: string;
}

const LAYOUT_SETTINGS = {
  gravity: 3,
  slowDown: 5,
  linLogMode: true,
  edgeWeightInfluence: 0,
  adjustSizes: false,
  outboundAttractionDistribution: false,
  strongGravityMode: false,
};

function GraphLoader({
  nodes,
  edges,
  nodeColor,
}: GraphData & {nodeColor: string}) {
  const loadGraph = useLoadGraph();
  // `stop`, never `kill`: killing is terminal, and the hook keeps handing back
  // the same dead supervisor afterwards, so the next `start()` throws "layout
  // was killed". The hook kills it for us when the component unmounts.
  const {start, stop} = useWorkerLayoutForceAtlas2({
    settings: LAYOUT_SETTINGS,
  });

  useEffect(() => {
    const g = new Graph();
    nodes.forEach((n) => {
      g.addNode(n.id, {
        label: n.label,
        color: n.color || nodeColor,
        type: n.type,
        size: 5,
        x: Math.random(),
        y: Math.random(),
      });
    });
    edges.forEach((e) => {
      if (g.hasNode(e.source) && g.hasNode(e.target) && !g.hasEdge(e.id)) {
        g.addEdgeWithKey(e.id, e.source, e.target, {
          // Cap thickness; raw co-occurrence counts (10+) would blow up
          // the edges.
          size: Math.min(Math.max(e.size ?? 1, 1), 5),
          color: e.color,
        });
      }
    });
    loadGraph(g);
    start();
    // Let the layout settle, then stop burning CPU on it.
    const timeout = window.setTimeout(() => stop(), 2000);
    return () => {
      window.clearTimeout(timeout);
      stop();
    };
  }, [nodes, edges, nodeColor, loadGraph, start, stop]);

  return null;
}

export default function NetworkGraph({graph, nodeColor, edgeColor}: Props) {
  // SigmaContainer rebuilds the renderer whenever its options change, so
  // keep them stable across renders.
  const options = useMemo(
    () => ({
      primitives: {
        nodes: {shapes: [sdfCircle(), sdfSquare()], layers: [layerFill()]},
      },
      // Passing `styles.nodes` / `styles.edges` replaces sigma's defaults
      // rather than extending them, so layer our overrides on top.
      styles: {
        nodes: [
          DEFAULT_STYLES.nodes,
          {
            shape: {attribute: 'type', defaultValue: 'circle'},
            color: {attribute: 'color', defaultValue: nodeColor},
            labelSize: 15,
          },
        ],
        edges: [
          DEFAULT_STYLES.edges,
          {color: {attribute: 'color', defaultValue: edgeColor}},
        ],
      },
      settings: {
        // Sigma 4 reads sizes in graph coordinates by default; keep sizing
        // them in pixels.
        itemSizesReference: 'screen' as const,
        renderLabels: true,
        labelRenderedSizeThreshold: 5,
      },
    }),
    [nodeColor, edgeColor]
  );

  if (!graph || graph.nodes.length === 0) return null;

  return (
    <SigmaContainer style={{display: 'flex', flexGrow: 1}} options={options}>
      <GraphLoader
        nodes={graph.nodes}
        edges={graph.edges}
        nodeColor={nodeColor}
      />
    </SigmaContainer>
  );
}
