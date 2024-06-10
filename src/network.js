// network graph utility functions

function interpolateNodeSize(minWords, maxWords, numOfWords) {
  const MAX_SIZE = 30;
  const MIN_SIZE = 15;
  return (
    MIN_SIZE +
    ((numOfWords - minWords) / (maxWords - minWords)) * (MAX_SIZE - MIN_SIZE)
  );
}

function getCooccurrences(segments) {
  const map = {};
  segments.forEach((s) => {
    if (!s.speakers) {
      return;
    }

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
            map[key] = pair.concat(1);
          }
        });
      }
    });
  });

  const cooccurrences = [];
  Object.keys(map)
    .sort()
    .forEach((key) => {
      cooccurrences.push(map[key]);
    });

  return cooccurrences;
}

export function makeGraph(
  characters,
  segments,
  nodeProps = {},
  edgeColor = 'black'
) {
  const maxWords = Math.max(...characters.map((p) => p.numOfWords));
  const minWords = Math.min(...characters.map((p) => p.numOfWords));
  const nodes = [];
  characters.forEach((p) => {
    const props = typeof nodeProps === 'function' ? nodeProps(p) : nodeProps;
    const nodeSize = interpolateNodeSize(minWords, maxWords, p.numOfWords);
    const node = {
      id: p.id,
      label: p.name,
      size: nodeSize || `#${p.id}`,
      ...props,
    };
    nodes.push(node);
  });
  const cooccurrences = getCooccurrences(segments);
  const edges = [];
  cooccurrences.forEach((cooc) => {
    edges.push({
      id: cooc[0] + '|' + cooc[1],
      source: cooc[0],
      target: cooc[1],
      size: cooc[2],
      // NB: we set the edge color here since the defaultEdgeColor in Sigma
      // settings does not to have any effect
      color: edgeColor,
    });
  });
  return {nodes, edges};
}
