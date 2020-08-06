import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { withRouter } from "react-router";

export function AuthRoute(props) {
  const { component: Component, path, exact } = props;
  const loggedIn = useSelector(state => !!state.session.user);
  return (
    <Route path={path} exact={exact} render={(p) => (
      !loggedIn ? (
        <Component {...p} />
      ) : (
        <Redirect to="/platform/" />
      )
    )} />
  );
}

export function ProtectedRoute(props) {
  const { component: Component, path, exact } = props;
  const loggedIn = useSelector(state => !!state.session.user);
  return (
    <Route path={path} exact={exact} render={(p) => (
      loggedIn ? (
        <Component {...p} />
      ) : (
        <Redirect to="/signin/" />
      )
    )} />
  );
}

export function AdminRoute(props) {
  const { component: Component, path, exact } = props;
  const isAdmin = useSelector(state => !!(state.session?.user?.data?.is_admin));
  return (
    <Route path={path} exact={exact} render={(p) => (
      isAdmin ? (
        <Component {...p} />
      ) : (
        null
      )
    )} />
  );
}
