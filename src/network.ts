// network graph utility functions

import type {Character, Segment} from './types';

export interface GraphNode {
  id: string;
  label: string;
  color?: string;
  type?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  size: number;
  color: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

type Cooccurrence = [string, string, number];

function getCooccurrences(segments: Segment[]): Cooccurrence[] {
  const map: Record<string, Cooccurrence> = {};
  segments.forEach((s) => {
    if (!s.speakers) return;

    // make sure each speaker occurs only once in scene
    const speakers = s.speakers.filter((v, i, a) => a.indexOf(v) === i);
    speakers.forEach((c, i) => {
      if (i < speakers.length - 1) {
        const others = speakers.slice(i + 1);
        others.forEach((o) => {
          const pair = [c, o].sort();
          const key = pair.join('|');
          if (map[key]) {
            map[key][2]++;
          } else {
            map[key] = [pair[0], pair[1], 1];
          }
        });
      }
    });
  });

  return Object.keys(map)
    .sort()
    .map((key) => map[key]);
}

type NodeProps =
  Partial<GraphNode> | ((character: Character) => Partial<GraphNode>);

export function makeGraph(
  characters: Character[],
  segments: Segment[],
  nodeProps: NodeProps = {},
  edgeColor = 'black'
): GraphData {
  const nodes: GraphNode[] = characters.map((p) => {
    const props = typeof nodeProps === 'function' ? nodeProps(p) : nodeProps;
    return {id: p.id, label: p.name || `#${p.id}`, ...props};
  });
  const cooccurrences = getCooccurrences(segments);
  const edges: GraphEdge[] = cooccurrences.map(([source, target, size]) => ({
    id: `${source}|${target}`,
    source,
    target,
    size,
    color: edgeColor,
  }));
  return {nodes, edges};
}
