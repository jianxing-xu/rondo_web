import Head from "components/Head";
import LoadingOrError from "components/LoadingOrError";
import React, { lazy, ReactElement, Suspense, useEffect } from "react";
import { Route, Router, Switch } from "react-router-dom";
import { createHashHistory } from "history";
import { getConfig } from "api/common";

const MainWindow = lazy(() => import("./pages/MainWindow"));
const Login = lazy(() => import("./pages/Login/Login"));

export const hashHistory = createHashHistory();

export default function App(): ReactElement {
  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition((pos) => {
      // alert(`wei: ${pos.coords.latitude}, jin: ${pos.coords.longitude}`)
    });
  }, []);
  return (
    <>
      <Router history={hashHistory}>
        <Head title="App" />
        <Suspense fallback={<LoadingOrError />}>
          <Switch>
            <Route exact path="/" component={MainWindow} />
            <Route path="/login" component={Login} />
          </Switch>
        </Suspense>
      </Router>
    </>
  );
}
