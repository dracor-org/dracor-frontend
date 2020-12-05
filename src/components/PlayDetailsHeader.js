import React from 'react';
import {Col} from 'reactstrap';
import classnames from 'classnames/bind';
import CorpusLabel from './CorpusLabel';
import Header from './Header';
import IdLink from './IdLink';
import Years from './Years';
import style from './PlayDetailsHeader.module.scss';

const cx = classnames.bind(style);

const PlayDetailsHeader = ({play}) => {
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
    <Header className={cx('main')}>
      <Col className={cx('left')}>
        <h1>{title}</h1>

        {subtitle && <h2 className={cx('subtitle')}>{subtitle}</h2>}

        {authors.length > 0 && (
          <h3 className={cx('authors')}>
            {authors.map(a => (
              <span key={a.key}>
                {a.name}
                {' '}
                {a.key && (
                  <span className="data-link-label">
                    <IdLink>{a.key}</IdLink>
                  </span>
                )}
              </span>
            ))}
          </h3>
        )}
      </Col>
      <Col className={cx('right')}>
        <CorpusLabel name={corpus} id={id}/>

        {wikidataId && (
          <span className="data-link-label">
            <IdLink>{`wikidata:${wikidataId}`}</IdLink>
          </span>
        )}

        <p className={cx('years')}>
          <Years
            written={yearWritten}
            premiere={yearPremiered}
            print={yearPrinted}
          />
        </p>
      </Col>
    </Header>
  );
};

export default PlayDetailsHeader;
