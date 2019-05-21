import React, {Component} from 'react';
import {Table, Tr, Td} from 'reactable';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import config from '../../config';

import './index.css';

const {apiUrl} = config;

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
        this.setState({data});
      })
      .catch(err => {
        console.log('parsing failed', err);
      });
  }

  renderTable () {
    const {data} = this.state;
    const {match} = this.props;
    if (!data || !data.dramas) {
      return null;
    }
    return (
      <Table
        className="table"
        sortable
        defaultSort={{column: 'Author', direction: 'asc'}}
        filterable={[
          'Author',
          'Title',
          'Source',
          'Network Size',
          'Year (normalized)'
        ]}
      >
        {data.dramas.map(d => {
          const authors = splitAuthors(d.authors).join(' · ');
          const keys = d.authors.map(a => {
            const matches = a.key.match(/^[Ww]ikidata:(Q[0-9]+)$/);
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
          const teiUrl =
            `${apiUrl}/corpora/${match.params.corpusId}/play/${d.id}/tei`;
          return (
            <Tr key={d.id}>
              <Td column="Author" value={authors}>
                <span>
                  {authors}
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
              </Td>
              <Td column="Title" value={d.title}>
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
              </Td>
              <Td column="Network Size" value={parseInt(d.networkSize, 10) || 0}>
                {d.networkSize}
              </Td>
              <Td
                column="Year (normalized)"
                value={parseInt(d.yearNormalized, 10) || 0}
                align="center"
              >
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
              </Td>
              <Td column="Source" value={d.source}>
                <span>
                  {d.sourceUrl ? <a href={d.sourceUrl}>{d.source}</a> : d.source}
                  <br/>
                  (<a href={teiUrl} target="_blank" rel="noopener noreferrer">TEI version</a>)
                </span>
              </Td>
            </Tr>
          );
        })}
      </Table>
    );
  }

  render () {
    const {data} = this.state;
    return data ? (
      <div>
        <Helmet titleTemplate="%s - DraCor">
          <title>{data.title}</title>
        </Helmet>
        <h2>{data.title}</h2>
        {this.renderTable()}
      </div>
    ) : (
      <em>loading...</em>
    );
  }
}

export default DramaIndex;
