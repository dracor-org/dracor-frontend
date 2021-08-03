import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import IdLink from './IdLink';
import {formatYear} from './Years';
import api from '../api';
import style from './AuthorInfo.module.scss';

const cx = classnames.bind(style);

const AuthorInfo = ({author: {fullname, refs = []}}) => {
  const [info, setInfo] = useState(null);

  const wikidataRef = refs.find((r) => r.type === 'wikidata');
  const wikidataId = wikidataRef ? wikidataRef.ref : undefined;

  useEffect(() => {
    async function fetchAuthorInfo() {
      const url = `/author/${wikidataId}`;
      console.log('loading author info %s ...', url);
      try {
        const response = await api.get(url);
        if (response.ok) {
          const info = {...response.data, birth: [], death: []};
          if (info.birthDate) {
            info.birth.push(
              formatYear(info.birthDate.replace(/^(-?\d{4}).*$/, '$1'))
            );
          }
          if (info.birthPlace) info.birth.push(info.birthPlace);

          if (info.deathDate) {
            info.death.push(
              formatYear(info.deathDate.replace(/^(-?\d{4}).*$/, '$1'))
            );
          }
          if (info.deathPlace) info.death.push(info.deathPlace);

          if (info.imageUrl) {
            info.imageUrl = info.imageUrl.replace(/^http:/, 'https:');
            info.commonsPage = info.imageUrl
              .replace(/Special:FilePath\//, 'File:')
              .replace(/^http:/, 'https:');
          }

          setInfo(info);
        } else if (response.status === 404) {
          console.log('not found');
        } else {
          console.log(response.originalError);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (wikidataId && wikidataId !== 'Q4233718' /* anonymous */) {
      fetchAuthorInfo();
    }
  }, [wikidataId]);

  const {name, imageUrl, commonsPage, birth = [], death = []} = info || {};

  return (
    <div className={cx('main')}>
      <div className={cx('image')}>
        {imageUrl && <img src={imageUrl} title={name} alt="" />}
        {commonsPage && (
          <a href={commonsPage} title="© Wikimedia Commons">
            <img
              src="/img/commons-logo.svg"
              width="17"
              alt="Wikimedia Commons"
            />
          </a>
        )}
      </div>
      <span>
        <h4>{fullname}</h4>
        {wikidataId && (
          <p>
            <IdLink button>{`wikidata:${wikidataId}`}</IdLink>
          </p>
        )}
        {birth.length > 0 && <p>b. {birth.join(', ')}</p>}
        {death.length > 0 && <p>d. {death.join(', ')}</p>}
      </span>
    </div>
  );
};

AuthorInfo.propTypes = {
  author: PropTypes.object.isRequired,
};

export default AuthorInfo;
