import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import type {Character} from '../types';

interface Props {
  characters: Character[];
  hasTitle?: boolean;
}

export default function CastList({characters, hasTitle}: Props) {
  return (
    <div className="flex w-full flex-col text-sm">
      {hasTitle && (
        <h4
          title="Characters in order of appearance"
          className="shrink-0 text-[1.3rem] font-normal m-0 mb-2 truncate"
        >
          Characters <small>(in order of appearance)</small>
        </h4>
      )}
      <ol
        className="w-full grow min-h-0 overflow-y-auto pb-6 mb-0 list-decimal list-inside pl-0"
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
