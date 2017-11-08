import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class DramaInfo extends Component {
  constructor (props) {
    super(props);
    console.log(props);
    this.state = { data: null };
  }

  componentWillReceiveProps ({match}) {
    const {corpusId, dramaId} = match.params;
    if (match.url !== this.props.match.url) {
      this.load(corpusId, dramaId);
    }
  }

  componentWillMount () {
    const {corpusId, dramaId} = this.props.match.params;
    this.load(corpusId, dramaId);
  }

  load (corpusId, dramaId) {
    const url = `/api/${corpusId}/${dramaId}/info`;
    console.log('loading %s', url);
    fetch(url, {}).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data);
      this.setState({data});
    }).catch((ex) => {
      console.log('parsing failed', ex)
    })
  }

  renderData () {
    const data = this.state.data
    if (!data) {
      return null;
    }
    const persons = data.persons || [];
    return (
      <div>
        <h3>{data.author.name}</h3>
        <h2>
          {data.title}
          <br/>
          <small>{data.subtitle}</small>
        </h2>
        <p>Segments: {data.segments.length}</p>
        <ol>{
            persons.map(p =>
              <li key={p.id}>
                <OverlayTrigger placement="right" overlay={<Tooltip id={`tootip-${p.id}`}>{p.id}</Tooltip>}>
                  <span>{p.name}</span>
                </OverlayTrigger>
              </li>)
          }
        </ol>
      </div>
    );
  }

  render () {
    return (
      this.state.data ? this.renderData() : <em>loading...</em>
    );
  }
}

export default DramaInfo;
