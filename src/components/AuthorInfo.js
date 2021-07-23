import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import IdLink from './IdLink';
import {formatYear} from './Years';
import api from '../api';
import style from './AuthorInfo.module.scss';

const cx = classnames.bind(style);

const AuthorInfo = ({author}) => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let wikidataId;

    async function fetchAuthorInfo() {
      const url = `/author/${wikidataId}`;
      console.log('loading author info %s ...', url);
      try {
        const response = await api.get(url);
        if (response.ok) {
          console.log(response.data);
          const info = {...response.data};
          if (info.birthDate) {
            info.birthYear = formatYear(
              info.birthDate.replace(/^(-?\d{4}).*$/, '$1')
            );
          }

          if (info.deathDate) {
            info.deathYear = formatYear(
              info.deathDate.replace(/^(-?\d{4}).*$/, '$1')
            );
          }

          if (info.imageUrl) {
            info.commonsPage = info.imageUrl.replace(
              /Special:FilePath\//,
              'File:'
            );
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

    const wikidataRef = author.refs.find((r) => r.type === 'wikidata');
    if (wikidataRef) {
      wikidataId = wikidataRef.ref;
    } else if (author.key && author.key.startsWith('wikidata:')) {
      wikidataId = author.key.slice(9);
    }

    if (wikidataId && wikidataId !== 'Q4233718' /* anonymous */) {
      fetchAuthorInfo();
    }
  }, [author]);

  const {
    name,
    imageUrl,
    commonsPage,
    birthYear,
    birthPlace,
    deathYear,
    deathPlace,
  } = info || {};

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
        <h4>{author.fullname}</h4>
        {author.key && (
          <p>
            <IdLink button>{author.key}</IdLink>
          </p>
        )}
        {(birthYear || birthPlace) && (
          <p>
            b. {birthYear}, {birthPlace}
          </p>
        )}
        {(deathYear || deathPlace) && (
          <p>
            d. {deathYear}, {deathPlace}
          </p>
        )}
      </span>
    </div>
  );
};

AuthorInfo.propTypes = {
  author: PropTypes.object.isRequired,
};

export default AuthorInfo;
