import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import {unregister} from './registerServiceWorker';

ReactDOM.render(<App/>, document.querySelector('#root'));
unregister();
