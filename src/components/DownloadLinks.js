import React, {useState} from 'react';
import PropTypes from 'prop-types';
import api from '../api';

const apiUrl = api.getBaseURL();

const DownloadLinks = ({play}) => {
  const [box, setBox] = useState(null);

  const playUrl = `${apiUrl}/corpora/${play.corpus}/play/${play.name}`;
  const csvUrl = `${playUrl}/networkdata/csv`;
  const gexfUrl = `${playUrl}/networkdata/gexf`;
  const graphmlUrl = `${playUrl}/networkdata/graphml`;
  const csvRelationsUrl = `${playUrl}/relations/csv`;
  const gexfRelationsUrl = `${playUrl}/relations/gexf`;

  function toggle (b) {
    setBox(b === box ? null : b);
    console.log(box);
  }

  return (
    <div>
      <span
        className="play-downloads-item"
        onClick={() => toggle('nd-formats')}
      >
        <i>network&nbsp;data</i>
        {box === 'nd-formats' && (
          <span className="formats">
            <a href={csvUrl} download={`${play.id}-${play.name}.csv`}>
              CSV
            </a>
            <a href={gexfUrl} download={`${play.id}-${play.name}.gexf`}>
              GEXF
            </a>
            <a
              href={graphmlUrl}
              download={`${play.id}-${play.name}.graphml`}
            >
              GraphML
            </a>
          </span>
        )}
      </span>{' '}
      <span
        className="play-downloads-item"
        onClick={() => toggle('rd-formats')}
      >
        <i>relation&nbsp;data</i>
        {box === 'rd-formats' && (
          <span className="formats">
            <a
              href={csvRelationsUrl}
              download={`${play.id}-${play.name}-relations.csv`}
            >
              CSV
            </a>
            <a
              href={gexfRelationsUrl}
              download={`${play.id}-${play.name}-relations.gexf`}
            >
              GEXF
            </a>
          </span>
        )}
      </span>{' '}
      <span
        className="play-downloads-item"
        onClick={() => toggle('st-formats')}
      >
        <i>spoken&nbsp;text</i>
        {box === 'st-formats' && (
          <span className="formats">
            <a
              href={`${playUrl}/spoken-text`}
              download={`${play.id}-${play.name}-spoken.txt`}
            >
              TXT
            </a>
          </span>
        )}
      </span>{' '}
      <span
        className="play-downloads-item"
        onClick={() => toggle('stc-formats')}
      >
        <i>spoken&nbsp;text&nbsp;by&nbsp;character</i>
        {box === 'stc-formats' && (
          <span className="formats">
            <a
              href={`${playUrl}/spoken-text-by-character.json`}
              download={`${play.id}-${play.name}-spoken.json`}
            >
              JSON
            </a>
          </span>
        )}
      </span>{' '}
      <span
        className="play-downloads-item"
        onClick={() => toggle('sd-formats')}
      >
        <i>stage&nbsp;directions</i>
        {box === 'sd-formats' && (
          <span className="formats">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${playUrl}/stage-directions`}
              download={`${play.id}-${play.name}-stage.txt`}
            >
              TXT
            </a>
          </span>
        )}
      </span>
    </div>
  );
};

DownloadLinks.propTypes = {
  play: PropTypes.object.isRequired
};

export default DownloadLinks;
