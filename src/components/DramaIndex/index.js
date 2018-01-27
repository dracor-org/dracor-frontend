import React, {Component} from 'react';
import {Table, Tr, Td} from 'reactable';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';

import './index.css';

function splitAuthorName (name) {
  if (/, /.test(name)) {
    return name;
  }
  const parts = name.split(' ');
  const last = parts.pop();
  return `${last}, ${parts.join(' ')}`;
}

function splitAuthors (authors) {
  return authors.map(author => splitAuthorName(author.name));
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
    const url = `/api/corpus/${corpusId}`;
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
        filterable={['Author', 'Title', 'Source']}
      >
        {data.dramas.map(d => {
          const authors = splitAuthors(d.authors).join(' · ');
          const keys = d.authors.map(a => a.key).join(' · ');
          return (
            <Tr key={d.id}>
              <Td column="Author" value={authors}>
                <span>
                  {authors}
                  <br/>
                  <small>{keys}</small>
                </span>
              </Td>
              <Td column="Title" value={d.title}>
                <span>
                  <Link to={`${match.url}/${d.id}`}>{d.title}</Link>
                  <br/>
                  <small>{d.subtitle}</small>
                </span>
              </Td>
              <Td column="Written" value={parseInt(d.writtenYear, 10) || 0}>
                {d.writtenYear}
              </Td>
              <Td column="Premiered" value={parseInt(d.premiereYear, 10) || 0}>
                {d.premiereYear}
              </Td>
              <Td column="Printed" value={parseInt(d.printYear, 10) || 0}>
                {d.printYear}
              </Td>
              <Td column="Source" value={d.source}>
                {d.sourceUrl ? <a href={d.sourceUrl}>{d.source}</a> : d.source}
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
        <Helmet titleTemplate="%s - Dracor.org">
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
