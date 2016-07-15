import React from 'react';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';

import App from './App.jsx';
import BaseComponents from './BaseComponents';

export default function Root() {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={BaseComponents} />
      </Route>
    </Router>
  );
}
