import {useEffect, useState} from 'react';
import classnames from 'classnames/bind';
import IdLink from './IdLink';
import {formatYear} from './Years';
import {fetchWikidataAuthor} from '../loaders';
import style from './AuthorInfo.module.scss';

const cx = classnames.bind(style);

const AuthorInfo = ({author: {fullname, refs = [], role}}) => {
  const [info, setInfo] = useState(null);

  const wikidataRef = refs.find((r) => r.type === 'wikidata');
  const wikidataId = wikidataRef ? wikidataRef.ref : undefined;

  useEffect(() => {
    async function loadAuthorInfo() {
      try {
        const data = await fetchWikidataAuthor(wikidataId);
        if (!data) return;
        const info = {...data, birth: [], death: []};
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
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    if (wikidataId && wikidataId !== 'Q4233718' /* anonymous */) {
      loadAuthorInfo();
    }
  }, [wikidataId]);

  const {name, imageUrl, commonsPage, birth = [], death = []} = info || {};

  const isTranslator = role === 'translator';

  return (
    <div className={cx('main', {'is-translator': isTranslator})}>
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
        {isTranslator && <span className={cx('role-badge')}>Translator</span>}
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

export default AuthorInfo;
