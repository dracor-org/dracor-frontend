import {useEffect} from 'react';
import Graph from 'graphology';
import {SigmaContainer, useLoadGraph} from '@react-sigma/core';
import {useWorkerLayoutForceAtlas2} from '@react-sigma/layout-forceatlas2';
import {NodeSquareProgram} from '@sigma/node-square';
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
  const {start, kill} = useWorkerLayoutForceAtlas2({
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
          // Cap thickness; raw co-occurrence counts (10+) would blow
          // up under sigma v3's WebGL edge program.
          size: Math.min(Math.max(e.size ?? 1, 1), 5),
          color: e.color,
        });
      }
    });
    loadGraph(g);
    start();
    const timeout = window.setTimeout(() => kill(), 2000);
    return () => {
      window.clearTimeout(timeout);
      kill();
    };
  }, [nodes, edges, nodeColor, loadGraph, start, kill]);

  return null;
}

export default function NetworkGraph({graph, nodeColor, edgeColor}: Props) {
  if (!graph || graph.nodes.length === 0) return null;

  return (
    <SigmaContainer
      style={{display: 'flex', flexGrow: 1}}
      settings={{
        defaultNodeColor: nodeColor,
        defaultEdgeColor: edgeColor,
        nodeProgramClasses: {square: NodeSquareProgram},
        renderLabels: true,
        labelRenderedSizeThreshold: 5,
        labelSize: 15,
      }}
    >
      <GraphLoader
        nodes={graph.nodes}
        edges={graph.edges}
        nodeColor={nodeColor}
      />
    </SigmaContainer>
  );
}
