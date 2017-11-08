import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import { Grid, Navbar } from 'react-bootstrap';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar>
            <Grid>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to="/">Dracor</Link>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
            </Grid>
          </Navbar>
          <Grid>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/:corpusId" component={DramaIndex}/>
            </Switch>
          </Grid>
        </div>
      </Router>

    );
  }
}

const Home = () => (
  <div>
    <h2>Welcome</h2>
    <ul>
      <li><Link to="/ger">German Drama Corpus</Link></li>
      <li><Link to="/rus">Russian Drama Corpus</Link></li>
    </ul>
  </div>
)

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
            <td><Link to={`${this.props.match.url}/${d.id}`}>{d.title}</Link></td>
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

export default App;
