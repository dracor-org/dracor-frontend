import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import { Grid, Modal, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
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
              <Route path="/" component={CorpusNav}/>
              <Nav pullRight>
                <NavItem href="https://dracor.org/ezlinavis/" target="_blank">
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

const CorpusNav = ({match, history}) => (
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
)

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
