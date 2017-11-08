import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import { Grid, Navbar } from 'react-bootstrap';
import DramaIndex from './components/DramaIndex';
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

export default App;
