import "core-js/stable";
import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/index';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

const initialState = {
  user: {
    isAuthenticated: false,
    profile: {}
  }
};

const store = configureStore(initialState);

ReactDom.render(
  <Provider store={store} >
    <BrowserRouter forceRefresh={true}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
)
