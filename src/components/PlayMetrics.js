import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import api from '../api';

function round (n) {
  return Math.round(n * 100) / 100;
}

const PlayMetrics = ({play}) => {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setError(null);
      const url = `/corpora/${play.corpus}/play/${play.name}/metrics`;
      try {
        const response = await api.get(url);
        if (response.ok) {
          setMetrics(response.data);
        } else if (response.status === 404) {
          setError(new Error('not found'));
        } else {
          setError(response.originalError);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMetrics();
  }, [play]);

  if (error) {
    console.log(error);
    return <p>Error!</p>;
  }

  if (!metrics) {
    return <p className="loading">Loading...</p>;
  }

  const {
    size,
    density,
    diameter,
    maxDegree,
    maxDegreeIds = [],
    averageDegree,
    averagePathLength,
    averageClustering
  } = metrics;

  const names = {};
  play.cast.forEach(c => {
    names[c.id] = c.name;
  });

  const maxDegreeNames = maxDegreeIds.map(id => names[id] || id).join(', ');

  const allInPercentage = Math.round(play.allInIndex * 100);

  return (
    <div>
      Segments: {play.segments.length}
      <br/>
      All-in at segment {play.allInSegment + ' '}
      (at {allInPercentage}%)
      <br/>
      <span title="number of characters">Network size</span>: {size}
      <br/>
      Density: {round(density)}
      <br/>
      Diameter: {diameter}
      <br/>
      Average path length: {round(averagePathLength)}
      <br/>
      Average clustering coefficient: {round(averageClustering)}
      <br/>
      Average degree: {round(averageDegree)}
      <br/>
      Maximum degree: {maxDegree} ({
        maxDegreeIds.length > 2
          ? <span title={maxDegreeNames}>{maxDegreeIds.length} characters</span>
          : <span>{maxDegreeNames}</span>
      })
    </div>
  );
};

PlayMetrics.propTypes = {
  play: PropTypes.object.isRequired
};

export default PlayMetrics;
