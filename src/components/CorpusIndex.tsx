import {Link} from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';
import {Commit, IdLink, Table, Years, formatEra} from '@dracor/react';
import type {ColumnDef} from '@tanstack/react-table';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {apiUrl} from '../config';
import type {CorpusDetail, PlayListEntry} from '../loaders';

function tokensForPeople(
  people: NonNullable<PlayListEntry['authors']>
): string {
  return people
    .map((p) => {
      const refs =
        'refs' in p && Array.isArray(p.refs)
          ? p.refs.map((r) => r.ref).join(' ')
          : '';
      const aka =
        'alsoKnownAs' in p && Array.isArray(p.alsoKnownAs)
          ? p.alsoKnownAs.join(' ')
          : '';
      return `${p.name} ${refs} ${aka}`;
    })
    .join(' ');
}

function AuthorsCell({row}: {row: PlayListEntry}) {
  const keys = (row.authors ?? [])
    .filter((a) => 'refs' in a && Array.isArray(a.refs))
    .map((a) => {
      const wikidataRef = (
        a as {refs?: {type: string; ref: string}[]}
      ).refs?.find((r) => r.type === 'wikidata');
      return wikidataRef?.ref;
    })
    .filter((id): id is string => !!id);
  return (
    <span>
      {row.authorNames}
      {keys.length > 0 && (
        <>
          <br />
          <small>
            {keys.map((id, i) => (
              <span key={id}>
                {i > 0 && ' '}
                <IdLink>{`wikidata:${id}`}</IdLink>
              </span>
            ))}
          </small>
        </>
      )}
      {row.translators && row.translators.length > 0 && (
        <>
          <br />
          <small className="text-gray-500 italic">
            transl. {row.translatorNames}
          </small>
        </>
      )}
    </span>
  );
}

function TitleCell({row, corpusId}: {row: PlayListEntry; corpusId: string}) {
  return (
    <span>
      <Link
        className="text-[1.5em]/[1] text-primary"
        to="/$corpusId/$playId"
        params={{corpusId, playId: row.name}}
      >
        {row.title}
      </Link>
      {row.subtitle && (
        <>
          <br />
          {row.subtitle}
        </>
      )}
      {row.wikidataId && (
        <>
          <br />
          <IdLink>{`wikidata:${row.wikidataId}`}</IdLink>
        </>
      )}
    </span>
  );
}

function YearCell({row}: {row: PlayListEntry}) {
  return (
    <span className="whitespace-nowrap text-[1.5em]/[0.9]">
      {row.yearNormalized != null &&
        formatEra(String(row.yearNormalized), 1000)}
      <br />
      <span className="text-[60%] whitespace-nowrap">
        {/* Years' props are typed as `number` upstream, but its formatYear
            handles the string forms the DraCor API emits ("-500/1000",
            ">1500", etc.). Cast until upstream widens the type. */}
        <Years
          written={row.yearWritten as unknown as number}
          premiere={row.yearPremiered as unknown as number}
          print={row.yearPrinted as unknown as number}
        />
      </span>
    </span>
  );
}

function SourceCell({row, corpusId}: {row: PlayListEntry; corpusId: string}) {
  const source =
    (row as PlayListEntry & {source?: {name?: string; url?: string}}).source ??
    {};
  const teiUrl = `${apiUrl}/corpora/${corpusId}/plays/${row.name}/tei`;
  return (
    <span>
      {source.url ? (
        <a target="_blank" rel="noopener noreferrer" href={source.url}>
          {source.name}
        </a>
      ) : (
        source.name
      )}
      <br />
      <a
        className="tei-download-button"
        href={teiUrl}
        target="_blank"
        rel="noreferrer noopener"
      >
        TEI version
      </a>
    </span>
  );
}

function buildColumns(corpusId: string): ColumnDef<PlayListEntry>[] {
  return [
    {
      id: 'authors',
      header: 'Authors',
      accessorFn: (row) => {
        const translatorTokens = row.translators
          ? tokensForPeople(row.translators)
          : '';
        return `${row.authorNames ?? ''} ${tokensForPeople(row.authors ?? [])} ${row.translatorNames ?? ''} ${translatorTokens}`;
      },
      cell: ({row}) => <AuthorsCell row={row.original} />,
      sortingFn: (a, b) =>
        (a.original.authorNames ?? '').localeCompare(
          b.original.authorNames ?? ''
        ),
      enableSorting: true,
    },
    {
      id: 'title',
      header: 'Title',
      accessorFn: (row) =>
        `${row.title} ${row.subtitle ?? ''} ${row.wikidataId ?? ''}`,
      cell: ({row}) => <TitleCell row={row.original} corpusId={corpusId} />,
      sortingFn: (a, b) => a.original.title.localeCompare(b.original.title),
      enableSorting: true,
    },
    {
      id: 'yearNormalized',
      header: () => (
        <>
          Year (normalized){' '}
          <Link
            to="/doc/$slug"
            params={{slug: 'faq'}}
            hash="normalized-year"
            title="FAQ: What is the normalized year?"
            className="ml-2"
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </Link>
        </>
      ),
      accessorFn: (row) =>
        `${row.yearNormalized ?? ''} ${row.yearWritten ?? ''} ${row.yearPremiered ?? ''} ${row.yearPrinted ?? ''}`,
      cell: ({row}) => <YearCell row={row.original} />,
      sortingFn: (a, b) => {
        const av = a.original.yearNormalized ?? Number.NEGATIVE_INFINITY;
        const bv = b.original.yearNormalized ?? Number.NEGATIVE_INFINITY;
        return av - bv;
      },
      enableSorting: true,
    },
    {
      id: 'networkSize',
      header: 'Network Size',
      accessorFn: (row) =>
        Number.parseInt(String(row.networkSize ?? 0), 10) || 0,
      cell: ({row}) =>
        Number.parseInt(String(row.original.networkSize ?? 0), 10) || 0,
      enableSorting: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessorFn: (row) => {
        const source = (row as PlayListEntry & {source?: {name?: string}})
          .source;
        return source?.name ?? '';
      },
      cell: ({row}) => <SourceCell row={row.original} corpusId={corpusId} />,
      enableSorting: true,
    },
    {
      id: 'id',
      header: 'ID',
      accessorFn: (row) => row.id,
      cell: ({row}) => row.original.id,
      enableSorting: true,
    },
  ];
}

interface Props {
  data: CorpusDetail;
}

export default function CorpusIndex({data}: Props) {
  if (!data?.plays) return null;

  const jsonUrl = `${apiUrl}/corpora/${data.name}/metadata`;
  const csvUrl = `${apiUrl}/corpora/${data.name}/metadata/csv`;

  return (
    <div>
      <title>{`${data.title} - DraCor`}</title>
      <div className="corpus-description">
        {data.description && <ReactMarkdown>{data.description}</ReactMarkdown>}
        {data.licence && (
          <p>
            <span>Corpus licensed under </span>
            <a
              href={data.licenceUrl}
              rel="noopener noreferrer licence"
              target="_blank"
            >
              {data.licence}
            </a>
          </p>
        )}
        {data.commit && (
          <p>
            Git commit: <Commit repo={data.repository}>{data.commit}</Commit>
          </p>
        )}
        <p>
          Download a comprehensive table with metadata on all plays in the
          corpus:{' '}
          <a
            className="tei-download-button"
            href={jsonUrl}
            target="_blank"
            rel="noreferrer noopener"
            download={`${data.name}dracor-metadata.json`}
          >
            JSON
          </a>{' '}
          <a
            className="tei-download-button"
            href={csvUrl}
            target="_blank"
            rel="noreferrer noopener"
            download={`${data.name}dracor-metadata.csv`}
          >
            CSV
          </a>
        </p>
      </div>
      <Table<PlayListEntry>
        data={data.plays}
        columns={buildColumns(data.name)}
        defaultSort={[{id: 'yearNormalized', desc: false}]}
      />
    </div>
  );
}
