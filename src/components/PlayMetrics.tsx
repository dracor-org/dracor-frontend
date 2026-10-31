import {Play, PlayMetrics as Metrics} from '../types';

function round(n: number) {
  return Math.round(n * 100) / 100;
}

interface Props {
  play: Play;
  metrics?: Metrics;
}

const PlayMetrics = ({play, metrics}: Props) => {
  if (!metrics) {
    return <p>Loading metrics…</p>;
  }

  const {
    size,
    density,
    diameter,
    maxDegree,
    maxDegreeIds = [],
    averageDegree,
    averagePathLength,
    averageClustering,
  } = metrics;

  const names: {[name: string]: string} = {};
  play.characters.forEach((c) => {
    names[c.id] = c.name;
  });

  const maxDegreeNames = maxDegreeIds.map((id) => names[id] || id).join(', ');

  const allInPercentage = Math.round((play.allInIndex || 0) * 100);

  return (
    <div>
      <h4>Network properties</h4>
      Segments: {play.segments.length}
      <br />
      All-in at segment {play.allInSegment + ' '}
      (at {allInPercentage}%)
      <br />
      <span title="number of characters">Network size</span>: {size}
      <br />
      Density: {round(density)}
      <br />
      Diameter: {diameter}
      <br />
      Average path length: {round(averagePathLength)}
      <br />
      Average clustering coefficient: {round(averageClustering)}
      <br />
      Average degree: {round(averageDegree)}
      <br />
      Maximum degree: {maxDegree} (
      {maxDegreeIds.length > 2 ? (
        <span title={maxDegreeNames}>{maxDegreeIds.length} characters</span>
      ) : (
        <span>{maxDegreeNames}</span>
      )}
      )
    </div>
  );
};

export default PlayMetrics;
