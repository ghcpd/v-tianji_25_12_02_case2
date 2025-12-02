import React from 'react';
// React 18+ uses the createRoot API
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import './styles/main.scss';
import 'core-js/stable';

const container = document.getElementById('root');
// Use the modern root API so the app is compatible with React 18+ / 19+
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
