import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames/bind';
import style from './CastList.module.scss';

const cx = classnames.bind(style);

const CastList = ({characters, hasTitle}) => (
  <div className={cx('main')}>
    {hasTitle && (
      <span className={cx('header')}>
        <h4 title="Characters in order of appearance">
          Characters <small>(in order of appearance)</small>
        </h4>
      </span>
    )}
    <ol className={cx('dracor-scrollbar')}>
      {characters.map((member) => (
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
              <img alt="Wikidata" src={'/wikidata.svg'} />
            </a>
          )}
        </li>
      ))}
    </ol>
  </div>
);

export default CastList;
