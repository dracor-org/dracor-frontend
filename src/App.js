import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Container, Modal, ModalHeader, ModalBody} from 'reactstrap';
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

class InfoModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      modal: true
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle () {
    this.setState(prevState => ({modal: !prevState.modal}));
  }

  close () {
    const {match, history} = this.props;
    const url = `/${match.params.corpusId}`;
    history.push(url);
  }

  render () {
    const {match} = this.props;
    const {modal} = this.state;
    return (
      <Modal
        isOpen={modal}
        toggle={this.toggle}
        onClosed={this.close.bind(this)}
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>network</ModalHeader>
        <ModalBody
          style={{
            height: '75vh',
            /* adjust for that Modal puts between header and body */
            marginTop: '-1.2em'
          }}
        >
          <DramaInfo {...match.params}/>
        </ModalBody>
      </Modal>
    );
  }
}

class App extends Component {
  render () {
    return (
      <Router>
        <div>
          <TopNav/>
          <Container>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/:corpusId" component={DramaIndex}/>
            </Switch>
            <Route path="/:corpusId/:dramaId" component={InfoModal}/>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
