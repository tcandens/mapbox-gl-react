require('es6-promise').polyfill();
require('isomorphic-fetch');
import React from 'react';
import { render } from 'react-dom';

import App from './App.jsx';

const rootEl = document.getElementById('root');
render(<App />, rootEl);
