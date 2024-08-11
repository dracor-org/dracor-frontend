import {createRoot} from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './index.scss';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
