import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import api from '../api';
import style from './DownloadLinks.module.scss';
import svgCSV from '../images/csv.svg';
import svgGEXF from '../images/gexf.svg';
import svgGraphML from '../images/graphml.svg';
import svgTXT from '../images/txt.svg';
import svgJSON from '../images/json.svg';
import svgTEI from '../images/tei.svg';

const cx = classnames.bind(style);

const apiUrl = api.getBaseURL();

const DownloadLinks = ({play}) => {
  const playUrl = `${apiUrl}/corpora/${play.corpus}/plays/${play.name}`;
  const csvUrl = `${playUrl}/networkdata/csv`;
  const gexfUrl = `${playUrl}/networkdata/gexf`;
  const graphmlUrl = `${playUrl}/networkdata/graphml`;
  const csvRelationsUrl = `${playUrl}/relations/csv`;
  const gexfRelationsUrl = `${playUrl}/relations/gexf`;
  const graphmlRelationsUrl = `${playUrl}/relations/graphml`;
  const jsonCharactersUrl = `${playUrl}/characters`;
  const csvCharactersUrl = `${playUrl}/characters/csv`;
  const teiUrl = `${playUrl}/tei`;

  return (
    <div className={cx('downloads')}>
      <span>
        <h4>Network data</h4>
        <p>Co-occurrence network:</p>
        <span className={cx('formats')}>
          <a href={csvUrl} download={`${play.id}-${play.name}.network.csv`}>
            <img src={svgCSV} alt="CSV" />
          </a>
          <a href={gexfUrl} download={`${play.id}-${play.name}.network.gexf`}>
            <img src={svgGEXF} alt="GEFX" />
          </a>
          <a
            href={graphmlUrl}
            download={`${play.id}-${play.name}.network.graphml`}
          >
            <img src={svgGraphML} alt="GraphML" />
          </a>
        </span>
        {play.relations ? (
          <>
            <p>
              Relation data (as described{' '}
              <a href="https://github.com/dracor-org/gerdracor#character-relations">
                here
              </a>
              ):
            </p>
            <span className={cx('formats')}>
              <a
                href={csvRelationsUrl}
                download={`${play.id}-${play.name}.relations.csv`}
              >
                <img src={svgCSV} alt="CSV" />
              </a>
              <a
                href={gexfRelationsUrl}
                download={`${play.id}-${play.name}.relations.gexf`}
              >
                <img src={svgGEXF} alt="GEXF" />
              </a>
              <a
                href={graphmlRelationsUrl}
                download={`${play.id}-${play.name}.relations.graphml`}
              >
                <img src={svgGraphML} alt="GraphML" />
              </a>
            </span>
          </>
        ) : (
          <>
            <p>Relation data not available.</p>
            <span className={cx('formats')}>
              <img disabled src={svgCSV} alt="CSV" />
              <img disabled src={svgGEXF} alt="GEXF" />
              <img disabled src={svgGraphML} alt="GraphML" />
            </span>
          </>
        )}
      </span>
      <span>
        <h4>Spoken text</h4>
        <p>By character:</p>
        <span className={cx('formats')}>
          <a
            href={`${playUrl}/spoken-text-by-character`}
            download={`${play.id}-${play.name}.spoken-text-by-character.json`}
          >
            <img src={svgJSON} alt="JSON" />
          </a>
        </span>
        <p>Plain (no markup):</p>
        <span className={cx('formats')}>
          <a
            href={`${playUrl}/spoken-text`}
            download={`${play.id}-${play.name}.spoken-text.txt`}
          >
            <img src={svgTXT} alt="TXT" />
          </a>
        </span>
      </span>
      <span>
        <h4>Stage directions</h4>
        <p>Without speaker names:</p>
        <span className={cx('formats')}>
          <a
            href={`${playUrl}/stage-directions`}
            download={`${play.id}-${play.name}.stage-directions.txt`}
          >
            <img src={svgTXT} alt="TXT" />
          </a>
        </span>
        <p>Including speaker names:</p>
        <span className={cx('formats')}>
          <a
            href={`${playUrl}/stage-directions-with-speakers`}
            download={`${play.id}-${play.name}.stage-directions-with-speakers.txt`}
          >
            <img src={svgTXT} alt="TXT" />
          </a>
        </span>
      </span>
      <span>
        <h4>List of characters</h4>
        <p>Including precalculated data:</p>
        <span className={cx('formats')}>
          <a
            href={csvCharactersUrl}
            download={`${play.id}-${play.name}.characters.csv`}
          >
            <img src={svgCSV} alt="CSV" />
          </a>
          <a
            href={jsonCharactersUrl}
            download={`${play.id}-${play.name}.characters.json`}
          >
            <img src={svgJSON} alt="JSON" />
          </a>
        </span>
      </span>
      <span>
        <h4>Full text</h4>
        <p>TEI-encoded:</p>
        <span className={cx('formats')}>
          <a href={teiUrl} download={`${play.id}-${play.name}.tei.xml`}>
            <img src={svgTEI} alt="TEI" />
          </a>
        </span>
      </span>
    </div>
  );
};

DownloadLinks.propTypes = {
  play: PropTypes.object.isRequired,
};

export default DownloadLinks;
