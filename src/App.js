import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import { Grid, Navbar, Modal } from 'react-bootstrap';
import DramaIndex from './components/DramaIndex';
import DramaInfo from './components/DramaInfo';
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
              <Route path="/:corpusId/:dramaId" component={DramaInfo}/>
            </Switch>
            <Route path="/:corpusId/:dramaId" component={InfoModal}/>
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

class InfoModal extends Component {
  close () {
    const url = `/${this.props.match.params.corpusId}`;
    this.props.history.push(url);
  }

  render () {
    return (
      <Modal show={true} bsSize="large" onHide={this.close.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>network</Modal.Title>
        </Modal.Header>
        ​<Modal.Body style={{
          height:'75vh',
          /* adjust for that Modal puts between header and body */
          marginTop: '-1.2em'
        }}>
          <DramaInfo {...this.props.match.params}/>
        </Modal.Body>
      </Modal>
    );
  }
}

export default App;
