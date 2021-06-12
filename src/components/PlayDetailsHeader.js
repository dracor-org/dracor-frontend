import React from 'react';
import PropTypes from 'prop-types';
import {Col} from 'reactstrap';
import classnames from 'classnames/bind';
import Sticky from 'react-stickynode';
import CorpusLabel from './CorpusLabel';
import Header from './Header';
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
          {children}
        </Sticky>
      </Col>
    </Header>
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
