import React from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import BootstrapTable from 'react-bootstrap-table-next';
// see https://github.com/react-bootstrap-table/react-bootstrap-table2/pull/1506
import ToolkitProvider, {
  Search,
} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min';
import ReactMarkdown from 'react-markdown';
import {apiUrl} from '../config';
import IdLink from './IdLink';
import Years, {formatEra} from './Years';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './CorpusIndex.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';

const {SearchBar} = Search;

function formatAuthor(authorNames, d) {
  const keys = d.authors
    .filter((a) => a.refs && a.refs.find((r) => r.type === 'wikidata'))
    .map((a) => {
      const wikidataRef = a.refs.find((r) => r.type === 'wikidata');
      const wikidataId = wikidataRef.ref;
      return (
        <IdLink key={wikidataId} button>
          {`wikidata:${wikidataId}`}
        </IdLink>
      );
    });
  return (
    <span>
      {authorNames}
      <br />
      <small>
        {keys.map((elem, i) => (
          <span key={`authorkey-${elem.key}`}>
            {Boolean(i) && ' '}
            {elem}
          </span>
        ))}
      </small>
    </span>
  );
}

function formatTitle(d, corpusId) {
  return (
    <span>
      <Link className="drama-title" to={`/${corpusId}/${d.name}`}>
        {d.title}
      </Link>
      {d.subtitle ? (
        <small>
          <br />
          {d.subtitle}
        </small>
      ) : null}
      {d.wikidataId && (
        <small>
          <br />
          <IdLink button>{`wikidata:${d.wikidataId}`}</IdLink>
        </small>
      )}
    </span>
  );
}

function formatYear(d) {
  return (
    <span className="year">
      {formatEra(d.yearNormalized, 1000)}
      <br />
      <span className="year-details">
        <Years
          written={d.yearWritten}
          premiere={d.yearPremiered}
          print={d.yearPrinted}
        />
      </span>
    </span>
  );
}

function formatYearHeader(column, colIndex, {sortElement}) {
  return (
    <>
      {column.text}
      {sortElement}
      <Link
        to="doc/faq/#normalized-year"
        title="FAQ: What is the normalized year?"
        style={{marginLeft: '0.5em'}}
      >
        <FontAwesomeIcon icon={faInfoCircle} />
      </Link>
    </>
  );
}

function formatSource(d, corpusId) {
  const {source = {}} = d;
  const teiUrl = `${apiUrl}/corpora/${corpusId}/plays/${d.name}/tei`;
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
        className="download-button"
        href={teiUrl}
        target="_blank"
        rel="noreferrer noopener"
      >
        TEI version
      </a>
    </span>
  );
}

const CorpusIndex = ({data}) => {
  if (!data || !data.plays) {
    return null;
  }

  const columns = [
    {
      dataField: 'authorNames',
      text: 'Authors',
      sort: true,
      filterValue: (cell, row) =>
        `${cell} ${row.authors
          .map((a) => {
            const refs = a.refs ? a.refs.map((r) => r.ref).join(' ') : '';
            let value = refs;
            if (a.alsoKnownAs) {
              value += a.alsoKnownAs.join(' ');
            }
            return value;
          })
          .join(' ')} `,
      formatter: formatAuthor,
    },
    {
      dataField: 'title',
      text: 'Title',
      sort: true,
      filterValue: (cell, row) =>
        `${row.title} ${row.subtitle} ${row.wikidataId}`,
      formatter: (cell, row) => formatTitle(row, data.name),
    },
    {
      dataField: 'yearNormalized',
      text: 'Year (normalized)',
      sort: true,
      sortFunc: (a, b, order) => {
        if (a === '') {
          return order === 'asc' ? -1 : 1;
        }

        if (b === '') {
          return order === 'asc' ? 1 : -1;
        }

        return order === 'asc' ? a - b : b - a;
      },
      filterValue: (cell, row) =>
        `${row.yearNormalized} ${row.yearWritten} ` +
        `${row.yearPremiered} ${row.yearPrinted}`,
      formatter: (cell, row) => formatYear(row),
      headerFormatter: formatYearHeader,
    },
    {
      dataField: 'networkSize',
      text: 'Network Size',
      formatter: (cell) => Number.parseInt(cell, 10) || 0,
      sort: true,
    },
    {
      dataField: 'source',
      text: 'Source',
      sort: true,
      filterValue: (cell, row) => (row.source ? row.source.name : ''),
      formatter: (cell, row) => formatSource(row, data.name),
    },
    {
      dataField: 'id',
      text: 'ID',
      sort: true,
    },
  ];

  const defaultSorted = [
    {
      dataField: 'yearNormalized',
      order: 'asc',
    },
  ];

  const jsonUrl = `${apiUrl}/corpora/${data.name}/metadata`;
  const csvUrl = `${apiUrl}/corpora/${data.name}/metadata/csv`;

  return (
    <div>
      <Helmet titleTemplate="%s - DraCor">
        <title>{data.title}</title>
      </Helmet>
      <ToolkitProvider
        search
        keyField="name"
        data={data.plays}
        columns={columns}
      >
        {(props) => (
          <div>
            <div className="corpus-description">
              {(data.description || data.license) && (
                <div>
                  {data.description && (
                    <ReactMarkdown>{data.description}</ReactMarkdown>
                  )}
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
                  <p>
                    Download a comprehensive table with metadata on all plays in
                    the corpus:{' '}
                    <a
                      className="download-corpus"
                      href={jsonUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      download={`${data.name}dracor-metadata.json`}
                    >
                      JSON
                    </a>{' '}
                    <a
                      className="download-corpus"
                      href={csvUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      download={`${data.name}dracor-metadata.csv`}
                    >
                      CSV
                    </a>
                  </p>
                </div>
              )}
              <SearchBar {...props.searchProps} />
            </div>
            <div className="corpus-wrapper">
              <BootstrapTable
                {...props.baseProps}
                bootstrap4
                defaultSorted={defaultSorted}
                defaultSortDirection="asc"
                classes="corpus"
              />
            </div>
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
};

export default CorpusIndex;
