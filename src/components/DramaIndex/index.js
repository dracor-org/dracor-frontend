import React, { Component } from 'react';
import {Table, Tr, Td} from 'reactable';
import { Link } from 'react-router-dom';

import './index.css';

class DramaIndex extends Component {
  constructor (props) {
    super(props);
    console.log(props);
    this.state = { data: null };
  }

  componentWillReceiveProps ({match}) {
    if (match.params.corpusId !== this.props.match.params.corpusId) {
      this.load(match.params.corpusId);
    }
  }

  componentWillMount () {
    const {match} = this.props;
    this.load(match.params.corpusId);
  }

  load (corpusId) {
    const url = `/api/${corpusId}/index`;
    const opts = {}
    console.log('loading %s', url);
    fetch(url, opts).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data);
      this.setState({data});
    }).catch((ex) => {
      console.log('parsing failed', ex)
    })
  }

  renderTable () {
    const data = this.state.data
    if (!data || !data.dramas) {
      return null;
    }
    return (
      <Table className="table"
        sortable={true}
        defaultSort={{column: 'Author', direction: 'asc'}}
        filterable={['Author', 'Title', 'Source']}>
        {data.dramas.map((d, i) =>
          <Tr key={d.id}>
            <Td column="Author" value={d.author.name}>
              <span>
                {d.author.name}
                <br/>
                <small>
                  {d.author.key}
                </small>
              </span>
            </Td>
            <Td column="Title" value={d.title}>
              <span>
                <Link to={`${this.props.match.url}/${d.id}`}>
                  {d.title}
                </Link>
                <br/>
                <small>
                  {d.subtitle}
                </small>
              </span>
            </Td>
            <Td column="Written" value={parseInt(d.writtenYear) || 0}>
              {d.writtenYear}
            </Td>
            <Td column="Premiered" value={parseInt(d.premiereYear) || 0}>
              {d.premiereYear}
            </Td>
            <Td column="Printed" value={parseInt(d.printYear) || 0}>
              {d.printYear}
            </Td>
            <Td column="Source">
              {d.source}
            </Td>
          </Tr>
        )}
      </Table>
    );
  }

  render () {
    return (
      this.state.data
      ? <div><h2>{this.state.data.title}</h2>{this.renderTable()}</div>
      : <em>loading...</em>
    );
  }
}

export default DramaIndex;
