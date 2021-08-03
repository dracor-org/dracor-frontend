import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames/bind';
import style from './CastList.module.scss';

const cx = classnames.bind(style);

const CastList = ({cast, hasTitle}) => (
  <div className={cx('main')}>
    {hasTitle && (
      <span className={cx('header')}>
        <h4>Cast list</h4>
        <p>(in order of appearance)</p>
      </span>
    )}
    <ol className={cx('dracor-scrollbar')}>
      {cast.map((member) => (
        <li key={member.id} title={member.id}>
          {member.name ? <span>{member.name}</span> : <em>{member.id}</em>}
          {'  '}
          {member.sex === 'MALE' && (
            <FontAwesomeIcon icon="mars" title="male" />
          )}
          {member.sex === 'FEMALE' && (
            <FontAwesomeIcon icon="venus" title="female" />
          )}{' '}
          {member.isGroup && <FontAwesomeIcon icon="users" size="sm" />}
          {member.wikidataId && (
            <a
              href={`https://www.wikidata.org/wiki/${member.wikidataId}`}
              title={`Wikidata: ${member.wikidataId}`}
            >
              <img
                alt="Wikidata"
                src={`${process.env.PUBLIC_URL}/wikidata.svg`}
              />
            </a>
          )}
        </li>
      ))}
    </ol>
  </div>
);

CastList.propTypes = {
  cast: PropTypes.array.isRequired,
  hasTitle: PropTypes.bool,
};

export default CastList;
