import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import MainRoute from './routes/MainRoute';
import registerServiceWorker from './registerServiceWorker';
import store from './store';

//const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <BrowserRouter basename={"/"}>
    <Provider store={store}>
      <MainRoute/>
    </Provider>
  </BrowserRouter>,
  rootElement);

registerServiceWorker();

