import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import type {Character} from '../types';

interface Props {
  characters: Character[];
  hasTitle?: boolean;
}

export default function CastList({characters, hasTitle}: Props) {
  return (
    <div className="relative flex w-full text-sm">
      {hasTitle && (
        <span
          className="absolute top-0 left-0 right-4 z-10 bg-neutral-100 pointer-events-none"
          style={{height: '2em'}}
        >
          <h4
            title="Characters in order of appearance"
            className="text-[1.3rem] font-normal m-0 truncate"
          >
            Characters <small>(in order of appearance)</small>
          </h4>
        </span>
      )}
      <ol
        className="w-full overflow-y-auto pt-[3.3em] pb-6 mb-0 list-decimal list-inside pl-0"
        style={{scrollbarWidth: 'thin'}}
      >
        {characters.map((member) => (
          <li key={member.id} title={member.id}>
            {member.name ? <span>{member.name}</span> : <em>{member.id}</em>}
            {'  '}
            {member.sex === 'MALE' && (
              <FontAwesomeIcon
                icon="mars"
                title="male"
                className="opacity-40"
              />
            )}
            {member.sex === 'FEMALE' && (
              <FontAwesomeIcon
                icon="venus"
                title="female"
                className="opacity-40"
              />
            )}{' '}
            {member.isGroup && (
              <FontAwesomeIcon
                icon="users"
                size="sm"
                className="text-secondary-200"
              />
            )}
            {member.wikidataId && (
              <a
                href={`https://www.wikidata.org/wiki/${member.wikidataId}`}
                title={`Wikidata: ${member.wikidataId}`}
              >
                <img
                  alt="Wikidata"
                  src="/wikidata.svg"
                  className="inline-block h-[0.8em]"
                />
              </a>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
