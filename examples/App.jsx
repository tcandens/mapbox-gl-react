import React from 'react';
import { Link } from 'react-router';

import './App.sass';

export default function App({ children }) {
  const routes = {
    '/': 'Base Components',
    '/collectionSource': 'Collection Source',
    '/circlesLayer': 'Circles Layer',
    '/queries': 'Queries',
    '/largeExample': 'Large Example',
    '/moveToMethod': 'MoveToMethods',
  };
  const routeLinks = Object.keys(routes).map((route, index) => (
    <Link to={route} key={index}>{routes[route]}</Link>
  ));
  return (
    <section className="container">
      <nav className="navigation">
        {routeLinks}
      </nav>
      {children}
    </section>
  );
}
