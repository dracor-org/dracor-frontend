// network graph utility functions

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

const nodeProps = (node) => {
  const {gender} = node;
  const color =
    gender === 'MALE' || gender === 'FEMALE' ? '#1f2448' : '#61affe';
  const type = gender === 'MALE' ? 'square' : 'circle';
  return {color, type};
};

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

export function makeGraph(characters, play, type = 'cooccurence') {
  const edgeColor = '#61affe65';
  const maxWords = Math.max(...characters.map((c) => c.numOfWords));
  const minWords = Math.min(...characters.map((c) => c.numOfWords));
  const nodes = [];
  characters.forEach((c) => {
    const props = nodeProps(c);
    const nodeSize = interpolateNodeSize(minWords, maxWords, c.numOfWords);
    const node = {
      id: c.id,
      label: c.name,
      size: nodeSize || `#${c.id}`,
      ...props,
    };
    nodes.push(node);
  });

  let edges = [];
  if (type === 'cooccurence') {
    const cooccurrences = getCooccurrences(play.segments);
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
  } else if (type === 'relation') {
    edges = (play.relations || []).map((r, i) => ({
      id: i,
      source: r.source,
      target: r.target,
      label: r.type,
      color: edgeColors[r.type] || edgeColor,
      type: r.directed ? 'curvedArrow' : 'curve',
    }));
  }

  return {nodes, edges};
}
