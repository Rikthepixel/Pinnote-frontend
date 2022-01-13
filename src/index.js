import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import HttpsRedirect from "react-https-redirect";
import App from './App';
const rootElement = document.getElementById('root');

ReactDOM.render(
  <HttpsRedirect>
    <BrowserRouter basename={"/"}>
      <App />
    </BrowserRouter>
  </HttpsRedirect>,
  rootElement);

registerServiceWorker();

