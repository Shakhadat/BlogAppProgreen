import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { store } from './store';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import App from './components/App';

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </BrowserRouter>
  </Provider>

), document.getElementById('root'));
