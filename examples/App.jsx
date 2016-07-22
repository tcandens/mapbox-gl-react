import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import compact from 'lodash/compact';

import './App.sass';

export default function App({ children, location }) {
  const routes = {
    '/': 'Base Components',
    '/collectionSource': 'Collection Source',
    '/circlesLayer': 'Circles Layer',
  };
  const routeLinks = Object.keys(routes).map((route, index) => {
    return <Link to={route} key={index}>{routes[route]}</Link>;
  });
  return (
    <section className="container">
      <nav className="navigation">
        {routeLinks}
      </nav>
      {children}
    </section>
  );
}
