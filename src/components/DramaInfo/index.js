import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// we need to require from react-sigma/lib/ to make build work
import {
  Sigma,
  EdgeShapes,
  NodeShapes,
  ForceAtlas2,
  RelativeSize,
  RandomizeNodePositions
} from 'react-sigma/lib/';

import './index.css'

const edgeColor = '#999';
const nodeColor = '#555';

function getCooccurrences (segments) {
  const map = {};
  segments.forEach(s => {
    if (!s.speakers) {
      return;
    }
    // make sure each speaker occurs only once in scene
    const speakers = s.speakers.filter((v, i, a) => a.indexOf(v) === i);
    speakers.forEach((c, i) => {
      if (i < speakers.length - 1) {
        const others = speakers.slice(i + 1);
        others.forEach(o => {
          const pair = [c, o].sort();
          const key = pair.join('|');
          if (map[key]) {
            map[key][2]++;
          } else {
            map[key] = pair.concat(1);
          }
        });
      }
    });
  });

  const cooccurrences = [];
  Object.keys(map).sort().forEach(key => {
    cooccurrences.push(map[key]);
  });

  return cooccurrences;
}

function makeGraph (persons, segments) {
  const nodes = [];
  persons.forEach(p => {
    nodes.push({id: p.id, label: p.name || `#${p.id}`});
  });
  const cooccurrences = getCooccurrences(segments);
  const edges = [];
  cooccurrences.forEach(cooc => {
    edges.push({
      id: cooc[0] + '|' + cooc[1],
      source: cooc[0],
      target: cooc[1],
      size: cooc[2],
      // NB: we set the edge color here since the defaultEdgeColor in Sigma
      // settings does not to have any effect
      color: edgeColor
    });
  });
  return {nodes, edges};
}

class DramaInfo extends Component {
  constructor (props) {
    super(props);
    console.log(props);
    this.state = { data: null };
  }

  componentWillReceiveProps (next) {
    const {corpusId, dramaId} = next;
    if (dramaId !== this.props.dramaId || corpusId !== this.props.corpusId) {
      this.load(corpusId, dramaId);
    }
  }

  componentWillMount () {
    const {corpusId, dramaId} = this.props;
    this.load(corpusId, dramaId);
  }

  load (corpusId, dramaId) {
    const url = `/api/${corpusId}/${dramaId}/info`;
    console.log('loading %s', url);
    fetch(url, {}).then((response) => {
      return response.json()
    }).then((data) => {
      const graph = makeGraph(data.persons, data.segments)
      console.log(data);
      console.log(graph);
      this.setState({data, graph});
    }).catch((ex) => {
      console.log('parsing failed', ex)
    })
  }

  renderData () {
    const data = this.state.data
    if (!data) {
      return null;
    }

    const settings = {
      maxEdgeSize: 5,
      defaultLabelSize: 15,
      defaultEdgeColor: edgeColor, // FIXME: this does not seem to work
      defaultNodeColor: nodeColor,
      labelThreshold: 5,
      labelSize: 'fixed',
      drawLabels: true,
      drawEdges: true
    };

    const layoutOptions = {
      iterationsPerRender: 1,
      edgeWeightInfluence: 0,
      timeout: 1000,
      adjustSizes: false,
      gravity: 3,
      slowDown: 5,
      linLogMode: true,
      outboundAttractionDistribution: false,
      strongGravityMode: false
    };

    const graph = this.state.graph;
    const layout = <ForceAtlas2 {...layoutOptions}/>;

    let sigma = null;
    if (graph && graph.nodes.length > 0) {
      sigma = (<Sigma
        renderer="canvas"
        graph={graph}
        settings={settings}
        style={{display: 'flex', flexGrow: 1}}
        >
        <EdgeShapes default="line"/>
        <NodeShapes default="circle"/>
        <RandomizeNodePositions>
          {layout}
          <RelativeSize initialSize={15}/>
        </RandomizeNodePositions>
      </Sigma>);
    }

    console.log(sigma);

    const persons = data.persons || [];
    return (
      <div className="drama-info">
        <h3>{data.author.name}</h3>
        <h2>
          {data.title}
          <br/>
          <small>{data.subtitle}</small>
        </h2>
        <p>Segments: {data.segments.length}</p>
        <div className="drama-info__cols">
          <div className="drama-info__cast">
            <ol>{
                persons.map(p =>
                  <li key={p.id}>
                    <OverlayTrigger placement="right"
                      overlay={<Tooltip id={`tootip-${p.id}`}>{p.id}</Tooltip>}>
                      {p.name ? <span>{p.name}</span> : <em>{p.id}</em>}
                    </OverlayTrigger>
                  </li>)
              }
            </ol>
          </div>

          <div className="drama-info__graph">
            {sigma}
          </div>
        </div>
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
