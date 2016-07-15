import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import compact from 'lodash/compact';

import './App.sass';

export default function App({ children, location, routes }) {
  const routeLinks = compact(routes.map((route, index) => {
    if (route.path) {
      return (
        <Link to={route.path} key={`route-${index}`}>
          {route.component.name}
        </Link>
      );
    }
  }));
  return (
    <section className="container">
      <nav className="navigation">
        {routeLinks}
      </nav>
      {children}
    </section>
  );
}
