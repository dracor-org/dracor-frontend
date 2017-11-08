import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Title</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
        {data.dramas.map((d, i) =>
          <tr key={d.id}>
            <td>{i + 1}</td>
            <td>
              {d.author.name}
              <br/>
              <small>{d.author.key}</small>
            </td>
            <td>
              <Link to={`${this.props.match.url}/${d.id}`}>{d.title}</Link>
              <br/>
              <small>{d.subtitle}</small>
            </td>
            <td>{d.source}</td>
          </tr>
        )}
        </tbody>
      </table>
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
