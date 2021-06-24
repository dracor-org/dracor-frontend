import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import Sticky from 'react-stickynode';
import CorpusLabel from './CorpusLabel';
import IdLink from './IdLink';
import Years from './Years';
import style from './PlayDetailsHeader.module.scss';

const cx = classnames.bind(style);

const PlayDetailsHeader = ({play, children}) => {
  const {
    id,
    authors,
    corpus,
    title,
    subtitle,
    wikidataId,
    yearPremiered,
    yearPrinted,
    yearWritten
  } = play;

  return (
    <div className={cx('main')}>
      <div className={cx('play')}>
        <div className={cx('title')}>
          <h1>{title}</h1>

          {subtitle && <h2 className={cx('subtitle')}>{subtitle}</h2>}

          <p className={cx('years')}>
            <Years
              written={yearWritten}
              premiere={yearPremiered}
              print={yearPrinted}
            />
          </p>

          <ul className={cx('meta')}>

          </ul>
        </div>
        <div className={cx('authors')}>
        {authors.map(a => (
                <div key={a.key} className={cx('author')}>
                  <div className={cx('author-image')}><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Johann_Christoph_Gottsched.jpg/440px-Johann_Christoph_Gottsched.jpg"/></div>
                  <span>
                    <h4>{a.fullname}</h4>
                    <p>* 2 February 1700, Königsberg</p>
                    <p>† 12 December 1766, Leipzig</p>
                    <p>Wikidata Author ID: {a.key && <IdLink>{a.key}</IdLink>}{' '}</p>
                  </span>
                </div>
              ))}
        </div>
      </div>

      <Sticky enabled innerZ={1}>
        <span>
          <CorpusLabel name={corpus}/>
          <div className={cx('sticky-headings')}>
            <p>DraCor ID: <a href={`/id/${id}`}>{id}</a>{' '}
            {wikidataId && (
              <span>
                {' '}Wikidata Title ID: 
                {' '}<IdLink>{`wikidata:${wikidataId}`}</IdLink>
              </span>
            )}
            </p>
            <h1>{title}</h1>
            <span>
              {authors.map(a => (
                <h3 key={a.key} className="data-link-label">
                  {a.fullname}
                </h3>
              ))}
            </span>
          </div>
        </span>
        {children}
      </Sticky>
    </div>
  );
};

PlayDetailsHeader.propTypes = {
  play: PropTypes.shape({
    id: PropTypes.string,
    authors: PropTypes.array,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    corpus: PropTypes.string,
    wikidataId: PropTypes.string,
    yearPremiered: PropTypes.string,
    yearPrinted: PropTypes.string,
    yearWritten: PropTypes.string
  }),
  children: PropTypes.element
};

export default PlayDetailsHeader;
