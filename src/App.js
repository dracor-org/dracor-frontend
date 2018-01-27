import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Container} from 'reactstrap';
import DramaIndex from './components/DramaIndex';
import DramaInfo from './components/DramaInfo';
import Metrics from './components/Metrics';
import TopNav from './components/TopNav';
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
