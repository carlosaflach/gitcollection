import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Dashboard } from '../pages/Dashboard';
// import { Repo } from '../pages/Repo';

const Dashboard = React.lazy(
  () =>
    import(
      /* webpackPrefetch: true */
      /* webpackChunkName: "Dashboard" */ '../pages/Dashboard'
    ),
);
const Repo = React.lazy(
  () =>
    import(
      /* webpackPrefetch: true */
      /* webpackChunkName: "Repo" */ '../pages/Repo'
    ),
);

export const Routes: React.FC = () => {
  return (
    <React.Suspense fallback={'Loading ...'}>
      <Switch>
        <Route component={Dashboard} exact path="/" />
        <Route component={Repo} exact path="/repositories/:repository+" />
      </Switch>
    </React.Suspense>
  );
};
