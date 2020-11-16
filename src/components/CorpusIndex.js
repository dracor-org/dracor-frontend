import React from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import ReactMarkdown from 'react-markdown';
import {apiUrl} from '../config';
import IdLink from './IdLink';
import Years, {formatEra} from './Years';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './CorpusIndex.css';

const {SearchBar} = Search;

function formatAuthor (authorNames, d) {
  const keys = d.authors.filter(a => a.key).map(a => {
    return <IdLink key={a.key} showLabel>{a.key}</IdLink>;
  });
  return (
    <span>
      {authorNames}
      <br/>
      <small className="data-link-label">
        {
          keys.map((elem, i) => (
            <span key={`authorkey-${elem.key}`}>
              {Boolean(i) && ' · '}
              {elem}
            </span>
          ))
        }
      </small>
    </span>
  );
}

function formatTitle (d, corpusId) {
  return (
    <span>
      <Link className="drama-title" to={`/${corpusId}/${d.name}`}>{d.title}</Link>
      {d.subtitle ? <small><br/>{d.subtitle}</small> : null}
      {d.wikidataId && (
        <small className="data-link-label">
          <br/>
          <IdLink showLabel>{`wikidata:${d.wikidataId}`}</IdLink>
        </small>
      )}
    </span>
  );
}

function formatYear (d) {
  return (
    <span className="year">
      {formatEra(d.yearNormalized, 1000)}
      <br/>
      <span className="year-details">
        <Years
          written={d.writtenYear}
          premiere={d.premiereYear}
          print={d.printYear}
        />
      </span>
    </span>
  );
}

function formatSource (d, corpusId) {
  const teiUrl = `${apiUrl}/corpora/${corpusId}/play/${d.name}/tei`;
  return (
    <span>
      {d.sourceUrl ? <a target="_blank" rel="noopener noreferrer" href={d.sourceUrl}>{d.source}</a> : d.source}
      <br/>
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
  if (!data || !data.dramas) {
    return null;
  }

  const columns = [{
    dataField: 'authorNames',
    text: 'Authors',
    sort: true,
    filterValue: (cell, row) =>
      `${cell} ${row.authors.map(a => a.key).join(' ')}`,
    formatter: formatAuthor
  }, {
    dataField: 'title',
    text: 'Title',
    sort: true,
    filterValue: (cell, row) =>
      `${row.title} ${row.subtitle} ${row.wikidataId}`,
    formatter: (cell, row) => formatTitle(row, data.name)
  }, {
    dataField: 'yearNormalized',
    text: 'Year (normalized)',
    sort: true,
    filterValue: (cell, row) => `${row.yearNormalized} ${row.writtenYear} ` +
      `${row.premiereYear} ${row.printYear}`,
    formatter: (cell, row) => formatYear(row)
  }, {
    dataField: 'networkSize',
    text: 'Network Size',
    formatter: cell => parseInt(cell, 10) || 0,
    sort: true
  }, {
    dataField: 'source',
    text: 'Source',
    sort: true,
    formatter: (cell, row) => formatSource(row, data.name)
  }, {
    dataField: 'id',
    text: 'ID',
    sort: true
  }];

  const defaultSorted = [{
    dataField: 'authorNames',
    order: 'asc'
  }];

  return (
    <div>
      <Helmet titleTemplate="%s - DraCor">
        <title>{data.title}</title>
      </Helmet>
      <ToolkitProvider
        search
        keyField="name"
        data={data.dramas}
        columns={columns}
      >
        {
          props => (
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
                  </div>
                )}
                <SearchBar {...props.searchProps}/>
              </div>
              <BootstrapTable
                {...props.baseProps}
                bootstrap4
                defaultSorted={defaultSorted}
                defaultSortDirection="asc"
                classes="corpus"
              />
            </div>
          )
        }
      </ToolkitProvider>
    </div>
  );
};

export default CorpusIndex;
