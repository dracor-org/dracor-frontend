import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import {Grid, Modal, Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import DramaIndex from './components/DramaIndex';
import DramaInfo from './components/DramaInfo';
import Metrics from './components/Metrics';
import './App.css';

const Home = () => (
  <div>
    <h2>Welcome</h2>
    <Metrics/>
    <div className="logos">
      <img src="/img/hse.png" alt="Higher School of Economics"/>
      <img src="/img/uni-potsdam.svg" alt="Universität Potsdam"/>
    </div>
  </div>
);

const CorpusNav = ({history}) => (
  <Nav>
    <NavDropdown title="Corpora" id="corpora-menu">
      <MenuItem
        eventKey="ger"
        onSelect={key => history.push(`/${key}`)}
      >German Drama Corpus
      </MenuItem>
      <MenuItem
        eventKey="rus"
        onSelect={key => history.push(`/${key}`)}
      >Russian Drama Corpus
      </MenuItem>
    </NavDropdown>
  </Nav>
);

class InfoModal extends Component {
  close () {
    const url = `/${this.props.match.params.corpusId}`;
    this.props.history.push(url);
  }

  render () {
    return (
      <Modal show bsSize="large" onHide={this.close.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>network</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            height: '75vh',
          /* adjust for that Modal puts between header and body */
            marginTop: '-1.2em'
          }}
        >
          <DramaInfo {...this.props.match.params}/>
        </Modal.Body>
      </Modal>
    );
  }
}

class App extends Component {
  render () {
    return (
      <Router>
        <div>
          <Navbar>
            <Grid>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to="/">Dracor</Link>
                </Navbar.Brand>
                <Navbar.Toggle/>
              </Navbar.Header>
              <Route path="/" component={CorpusNav}/>
              <Nav pullRight>
                <NavItem href="https://ezlinavis.dracor.org/" target="_blank">
                  Easy Linavis
                </NavItem>
              </Nav>
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

export default App;
