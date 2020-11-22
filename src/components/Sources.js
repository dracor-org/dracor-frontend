import React from 'react';
import PropTypes from 'prop-types';

const Sources = ({play}) => {
  const {source, originalSource} = play;
  return (
    <div>
      {!(source || originalSource) && (
        <p>No source information available</p>
      )}

      {source && (
        <p>
          {'Source: '}
          {play.source.url ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={play.source.url}
            >
              {play.source.name}
            </a>
          ) : (
            play.source.name
          )}
        </p>
      )}

      {originalSource && (
        <p>Original Source: {play.originalSource}</p>
      )}
    </div>
  );
};

Sources.propTypes = {
  play: PropTypes.object.isRequired
};

export default Sources;
