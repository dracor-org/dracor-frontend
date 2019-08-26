import React from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {apiUrl} from '../config';
import IdLink from './IdLink';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './CorpusIndex.css';

const {SearchBar} = Search;

function formatAuthor (authorNames, d) {
  const keys = d.authors.map(a => {
    return a.key ? <IdLink key={a.key} showLabel>{a.key}</IdLink> : null;
  });
  return (
    <span>
      {authorNames}
      <br/>
      <small>
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
      <Link to={`/${corpusId}/${d.name}`}>{d.title}</Link>
      {d.subtitle ? <small><br/>{d.subtitle}</small> : null}
      {d.wikidataId && (
        <small>
          <br/>
          <IdLink showLabel>{`wikidata:${d.wikidataId}`}</IdLink>
        </small>
      )}
    </span>
  );
}

function formatEra (year) {
  if (year === null) {
    return '';
  }

  return year < 0 ? `${year * -1} BCE` : String(year);
}

function formatYear (d) {
  const yWritten = d.writtenYear ? (
    <span title="written">
      <FontAwesomeIcon icon="pen-fancy" size="sm"/>&nbsp;
      {formatEra(d.writtenYear)}
    </span>
  ) : null;
  const yPrint = d.printYear ? (
    <span title="printed">
      <FontAwesomeIcon icon="book" size="sm"/>&nbsp;
      {formatEra(d.printYear)}
    </span>
  ) : null;
  const yPremiere = d.premiereYear ? (
    <span title="premiered">
      <FontAwesomeIcon icon="theater-masks" size="sm"/>&nbsp;
      {formatEra(d.premiereYear)}
    </span>
  ) : null;
  return (
    <span>
      {formatEra(d.yearNormalized)}
      <br/>
      <span className="year-details">
        {yWritten}
        {' '}
        {yPremiere}
        {' '}
        {yPrint}
      </span>
    </span>
  );
}

function formatSource (d, corpusId) {
  const teiUrl = `${apiUrl}/corpora/${corpusId}/play/${d.name}/tei`;
  return (
    <span>
      {d.sourceUrl ? <a href={d.sourceUrl}>{d.source}</a> : d.source}
      <br/>(<a href={teiUrl} target="_blank" rel="noopener noreferrer">TEI version</a>)
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
    dataField: 'networkSize',
    text: 'Network Size',
    formatter: cell => parseInt(cell, 10) || 0,
    sort: true
  }, {
    dataField: 'yearNormalized',
    text: 'Year (normalized)',
    sort: true,
    filterValue: (cell, row) => `${row.yearNormalized} ${row.writtenYear} ` +
      `${row.premiereYear} ${row.printYear}`,
    formatter: (cell, row) => formatYear(row)
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
              <SearchBar {...props.searchProps}/>
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
