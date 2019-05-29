import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Container} from 'reactstrap';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faBook,
  faPenFancy,
  faTheaterMasks
} from '@fortawesome/free-solid-svg-icons';
import asyncComponent from './components/AsyncComponent';
import DramaIndex from './components/DramaIndex';
import DramaInfo from './components/DramaInfo';
import Metrics from './components/Metrics';
import TopNav from './components/TopNav';
import './App.css';

library.add(faBook, faPenFancy, faTheaterMasks);

const AsyncYasgui = asyncComponent(() => import('./components/Yasgui'));
const AsyncAPIDoc = asyncComponent(() => import('./components/APIDoc'));

const Home = () => (
  <div>
    <h2>Welcome</h2>
    <Metrics/>
    <div className="logos">
      <img src="/img/hse.png" alt="Higher School of Economics"/>
      <img src="/img/uni-potsdam.svg" alt="Universität Potsdam"/>
    </div>
    <div style={{textAlign: 'center', maxWidth: '750px', margin: '1em auto'}}>
      <small>
        <em>
          {`Our two in-house TEI corpora (RusDraCor and GerDraCor) hosted on
            dracor.org are in public-alpha state. Feel free to use them, but
            there are some issues that still have to be resolved before the
            official release, which is planned for the second half of 2019. –
            SpanDraCor is based on our fork of the `
          }
          <a href="https://github.com/GHEDI/BETTE">
            BETTE corpus
          </a>
          {'. – ShakeDraCor was derived from the '}
          <a href="https://www.folgerdigitaltexts.org/">
            Shakespeare Folger Library
          </a>
          {'. – dracor.org is edited by '}
          <a href="https://www.hse.ru/en/org/persons/182492735">
            Frank&nbsp;Fischer
          </a>
          {' (Higher School of Economics, Moscow) and '}
          <a href="https://www.uni-potsdam.de/de/lit-19-jhd/peertrilcke.html">
            Peer&nbsp;Trilcke
          </a>
          {' (University of Potsdam).'}
        </em>
      </small>
    </div>
  </div>
);

const DramaPage = ({match}) => (
  <div style={{height: '100%'}}>
    <DramaInfo {...match.params}/>
  </div>
);

class App extends Component {
  render () {
    return (
      <Router>
        <div className="d-flex flex-column" style={{height: '100%'}}>
          <TopNav/>
          <div className="content d-flex" style={{flex: 1}}>
            <Container fluid>
              <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/sparql" component={AsyncYasgui}/>
                <Route exact path="/documentation/api" component={AsyncAPIDoc}/>
                <Route exact path="/:corpusId" component={DramaIndex}/>
                <Route path="/:corpusId/:dramaId" component={DramaPage}/>
              </Switch>
            </Container>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
