import React from 'react';
import {Col} from 'reactstrap';
import classnames from 'classnames/bind';
import Sticky from 'react-stickynode';
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
    source,
    originalSource,
    wikidataId,
    yearPremiered,
    yearPrinted,
    yearWritten
  } = play;

  return (
    <Header className={cx('main')}>
      <Col>
        <div className={cx('title')}>
          <h1>{title}</h1>

          {subtitle && <h2 className={cx('subtitle')}>{subtitle}</h2>}

          <p className={cx('years')}>
            <Years
              written={yearWritten}
              premiere={yearPremiered}
              print={yearPrinted}
            />
            {wikidataId && (
              <span className="data-link-label">
                {' '}
                <IdLink>{`wikidata:${wikidataId}`}</IdLink>
              </span>
            )}
          </p>

          <ul className={cx('meta')}>
            {source && (
              <li>
                Source:{' '}
                {source.url ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={source.url}
                  >
                    {source.name}
                  </a>
                ) : (
                  source.name
                )}
              </li>
            )}

            {originalSource && (
              <li>Original Source: {originalSource}</li>
            )}
            <li>
              DraCor: <a href={`/id/${id}`}>{id}</a>
            </li>
          </ul>
        </div>

        <Sticky enabled innerZ={1}>
          <span>
            <CorpusLabel name={corpus}/>
            <div className={cx('sticky-headings')}>
              <h1>{title}</h1>
              <span>
                {authors.map(a => (
                  <h3 key={a.key} className="data-link-label">
                    {a.fullname}{' '} {a.key && <IdLink>{a.key}</IdLink>}
                  </h3>
                ))}
              </span>
            </div>
          </span>
        </Sticky>
      </Col>
    </Header>
  );
};

export default PlayDetailsHeader;
