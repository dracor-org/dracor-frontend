import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import IdLink from './IdLink';
import api from '../api';
import style from './AuthorInfo.module.scss';

const cx = classnames.bind(style);

const AuthorInfo = ({author}) => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    async function fetchAuthorInfo () {
      const url = `/author/${wikidataId}`;
      console.log('loading author info %s ...', url);
      try {
        const response = await api.get(url);
        if (response.ok) {
          console.log(response.data);
          const info = {...response.data};
          if (info.birthDate) {
            info.birthYear = info.birthDate.slice(0, 4);
          }

          if (info.deathDate) {
            info.deathYear = info.deathDate.slice(0, 4);
          }

          if (info.imageUrl) {
            info.commonsPage = info.imageUrl.replace(
              /Special:FilePath\//, 'File:'
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

    let wikidataId;
    const wikidataRef = author.refs.find(r => r.type === 'wikidata');
    if (wikidataRef) {
      wikidataId = wikidataRef.ref;
    } else if (author.key && author.key.startsWith('wikidata:')) {
      wikidataId = author.key.slice(9);
    }

    if (wikidataId) {
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
    deathPlace
  } = info || {};

  return (
    <div className={cx('main')}>
      <div className={cx('image')}>
        {imageUrl && (
          <img src={imageUrl} title={name} alt=""/>
        )}
        {commonsPage && (
          <a href={commonsPage} title="(C) Wikimedia Commons">
            <img src="/img/commons-logo.svg" width="17" alt="Wikimedia Commons"/>
          </a>
        )}
      </div>
      <span>
        <h4>{author.fullname}</h4>
        {(birthYear || birthPlace) && (
          <p>b. {birthYear} {birthPlace}</p>
        )}
        {(deathYear || deathPlace) && (
          <p>d. {deathYear} {deathPlace}</p>
        )}
        {author.key && (
          <p>Wikidata Author ID: <IdLink>{author.key}</IdLink></p>
        )}
      </span>
    </div>
  );
};

AuthorInfo.propTypes = {
  author: PropTypes.object.isRequired
};

export default AuthorInfo;
