import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import Sticky from 'react-stickynode';
import AuthorInfo from './AuthorInfo';
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

          <span className={cx('meta')}>
            {wikidataId && (
              <IdLink button className={cx('data-link')}>
                {`wikidata:${wikidataId}`}
              </IdLink>
            )}
            <span className={cx('years')}>
              <Years
                written={yearWritten}
                premiere={yearPremiered}
                print={yearPrinted}
              />
            </span>
          </span>
        </div>
        <div className={cx('authors')}>
          {authors.map(a => <AuthorInfo key={id} author={a}/>)}
        </div>
      </div>

      <Sticky enabled innerZ={1}>
        <span>
          <CorpusLabel name={corpus} id={id}/>
          <div className={cx('sticky-headings')}>
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
