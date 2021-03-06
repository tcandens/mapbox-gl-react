import React from 'react';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';

import App from './App.jsx';
import BaseComponents from './BaseComponents';
import CollectionSourceExample from './CollectionSource';
import CirclesLayerExample from './CirclesLayer';
import QueriesExample from './queries';
import LargeExample from './LargeExample';
import MoveToMethod from './MoveToMethod';

export default function Root() {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={BaseComponents} />
        <Route path="/collectionSource" component={CollectionSourceExample} />
        <Route path="/circlesLayer" component={CirclesLayerExample} />
        <Route path="/queries" component={QueriesExample} />
        <Route path="/largeExample" component={LargeExample} />
        <Route path="/moveToMethod" component={MoveToMethod} />
      </Route>
    </Router>
  );
}
