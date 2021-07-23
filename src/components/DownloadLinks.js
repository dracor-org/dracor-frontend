import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import api from '../api';
import style from './DownloadLinks.module.scss';
import svgCSV from '../images/csv.svg';
import svgGEXF from '../images/gexf.svg';
import svgGraphML from '../images/graphml.svg';
import svgTXT from '../images/txt.svg';
import svgRDF from '../images/rdf.svg';
import svgJSON from '../images/json.svg';
import svgTEI from '../images/tei.svg';

const cx = classnames.bind(style);

const apiUrl = api.getBaseURL();

const DownloadLinks = ({play}) => {
  const playUrl = `${apiUrl}/corpora/${play.corpus}/play/${play.name}`;
  const csvUrl = `${playUrl}/networkdata/csv`;
  const gexfUrl = `${playUrl}/networkdata/gexf`;
  const graphmlUrl = `${playUrl}/networkdata/graphml`;
  const csvRelationsUrl = `${playUrl}/relations/csv`;
  const gexfRelationsUrl = `${playUrl}/relations/gexf`;
  const jsonCastUrl = `${playUrl}/cast`;
  const csvCastUrl = `${playUrl}/cast/csv`;
  const rdfUrl = `${playUrl}/rdf`;
  const teiUrl = `${playUrl}/tei`;

  return (
    <div className={cx('downloads')}>
      <span>
        <h4>Network data</h4>
        <p>Co-occurrence network:</p>
        <span className={cx('formats')}>
          <a href={csvUrl} download={`${play.id}-${play.name}.csv`}>
            <img src={svgCSV} />
          </a>
          <a href={gexfUrl} download={`${play.id}-${play.name}.gexf`}>
            <img src={svgGEXF} />
          </a>
          <a href={graphmlUrl} download={`${play.id}-${play.name}.graphml`}>
            <img src={svgGraphML} />
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
                download={`${play.id}-${play.name}.csv`}
              >
                <img src={svgCSV} />
              </a>
              <a
                href={gexfRelationsUrl}
                download={`${play.id}-${play.name}.gexf`}
              >
                <img src={svgGEXF} />
              </a>
            </span>
          </>
        ) : (
          <>
            <p>Relation data not available.</p>
            <span className={cx('formats')}>
              <img disabled src={svgCSV} />
              <img disabled src={svgGEXF} />
            </span>
          </>
        )}
      </span>
      <span>
        <h4>Spoken text</h4>
        <p>By character:</p>
        <span className={cx('formats')}>
          <a
            href={`${playUrl}/spoken-text-by-character.json`}
            download={`${play.id}-${play.name}-spoken.json`}
          >
            <img src={svgJSON} />
          </a>
        </span>
        <p>Plain (no markup):</p>
        <span className={cx('formats')}>
          <a
            href={`${playUrl}/spoken-text`}
            download={`${play.id}-${play.name}-spoken.txt`}
          >
            <img src={svgTXT} />
          </a>
        </span>
      </span>
      <span>
        <h4>Stage directions</h4>
        <p>Without speaker names:</p>
        <span className={cx('formats')}>
          <a
            href={`${playUrl}/stage-directions`}
            download={`${play.id}-${play.name}-stage.txt`}
          >
            <img src={svgTXT} />
          </a>
        </span>
        <p>Including speaker names:</p>
        <span className={cx('formats')}>
          <a
            href={`${playUrl}/stage-directions-with-speakers`}
            download={`${play.id}-${play.name}-stage-with-speakers.txt`}
          >
            <img src={svgTXT} />
          </a>
        </span>
      </span>
      <span>
        <h4>List of characters</h4>
        <p>Including precalculated data:</p>
        <span className={cx('formats')}>
          <a href={csvCastUrl} download={`${play.id}-${play.name}-cast.csv`}>
            <img src={svgCSV} />
          </a>
          <a href={jsonCastUrl} download={`${play.id}-${play.name}-cast.json`}>
            <img src={svgJSON} />
          </a>
        </span>
      </span>
      <span>
        <h4>Full text</h4>
        <p>TEI-encoded:</p>
        <span className={cx('formats')}>
          <a href={teiUrl} download={`${play.id}-${play.name}.tei.xml`}>
            <img src={svgTEI} />
          </a>
        </span>
      </span>
      <span>
        <h4>Linked data</h4>
        <p>In RDF format:</p>
        <span className={cx('formats')}>
          <a href={rdfUrl} download={`${play.id}-${play.name}.rdf`}>
            <img src={svgRDF} />
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
