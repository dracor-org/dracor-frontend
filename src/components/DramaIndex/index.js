import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import config from '../../config';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './index.css';

const {apiUrl} = config;
const {SearchBar} = Search;

function splitAuthorName (name) {
  // just pass through names that already have been split (i.e. having a comma)
  // or are just a single names (e.g. Klabund)
  if (/, /.test(name) || /^[^ ]+$/.test(name)) {
    return name;
  }

  const parts = name.split(' ');
  const last = parts.pop();
  return `${last}, ${parts.join(' ')}`;
}

function splitAuthors (authors) {
  return authors.map(author => splitAuthorName(author.name));
}

function join (base, path) {
  return base.replace(/\/$/, '') + '/' + path;
}

function formatAuthor (authorNames, d) {
  const keys = d.authors.map(a => {
    const matches = a.key.match(/^[Ww]ikidata:(Q\d+)$/);
    if (matches) {
      const id = matches[1];
      return (
        <span key={id}>
          Wikidata:
          {' '}
          <a href={`https://www.wikidata.org/wiki/${id}`}>{id}</a>
        </span>
      );
    }

    return <span key={a.key}>{a.key}</span>;
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

function formatTitle (d, match) {
  return (
    <span>
      <Link to={join(match.url, d.id)}>{d.title}</Link>
      {d.subtitle ? <small><br/>{d.subtitle}</small> : null}
      {d.wikidataId ?
        <small>
          <br/>
          Wikidata:
          {' '}
          <a
            href={`https://www.wikidata.org/wiki/${d.wikidataId}`}
            title="Wikidata"
          >
            {d.wikidataId}
          </a>
        </small>
        : null}
    </span>
  );
}

function formatYear (d) {
  const yWritten = d.writtenYear ? (
    <span title="written">
      <FontAwesomeIcon icon="pen-fancy" size="sm"/>&nbsp;
      {d.writtenYear}
    </span>
  ) : null;
  const yPrint = d.printYear ? (
    <span title="printed">
      <FontAwesomeIcon icon="book" size="sm"/>&nbsp;
      {d.printYear}
    </span>
  ) : null;
  const yPremiere = d.premiereYear ? (
    <span title="premiered">
      <FontAwesomeIcon icon="theater-masks" size="sm"/>&nbsp;
      {d.premiereYear}
    </span>
  ) : null;
  return (
    <span>
      {d.yearNormalized}
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
  const teiUrl = `${apiUrl}/corpora/${corpusId}/play/${d.id}/tei`;
  return (
    <span>
      {d.sourceUrl ? <a href={d.sourceUrl}>{d.source}</a> : d.source}
      <br/>(<a href={teiUrl} target="_blank" rel="noopener noreferrer">TEI version</a>)
    </span>
  );
}

class DramaIndex extends Component {
  constructor (props) {
    super(props);
    console.log(props);
    this.state = {data: null};
  }

  componentWillReceiveProps (next) {
    const {match} = this.props;
    if (match.params.corpusId !== next.match.params.corpusId) {
      this.load(next.match.params.corpusId);
    }
  }

  componentWillMount () {
    const {match} = this.props;
    this.load(match.params.corpusId);
  }

  load (corpusId) {
    const url = `${apiUrl}/corpora/${corpusId}`;
    const opts = {};
    console.log('loading %s', url);
    fetch(url, opts)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        data.dramas.forEach(d => {
          d.networkSize = parseInt(d.networkSize, 10) || 0;
          d.authorNames = splitAuthors(d.authors).join(' · ');
        });
        this.setState({data});
      })
      .catch(error => {
        console.log('parsing failed', error);
      });
  }

  render () {
    const {data} = this.state;
    const {match} = this.props;

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
      formatter: (cell, row) => formatTitle(row, match)
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
    }];

    const defaultSorted = [{
      dataField: 'authorNames',
      order: 'asc'
    }];

    return data ? (
      <div>
        <Helmet titleTemplate="%s - DraCor">
          <title>{data.title}</title>
        </Helmet>
        <h2>{data.title}</h2>
        <ToolkitProvider
          search
          keyField="id"
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
                />
              </div>
            )
          }
        </ToolkitProvider>
      </div>
    ) : (
      <em>loading...</em>
    );
  }
}

export default DramaIndex;
