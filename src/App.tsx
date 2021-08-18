import Head from "components/Head";
import LoadingOrError from "components/LoadingOrError";
import React, { lazy, ReactElement, Suspense } from "react";
import { Route, Router, Switch } from "react-router-dom";
import { createHashHistory } from "history";

const MainWindow = lazy(() => import("./pages/MainWindow"));
const Login = lazy(() => import("./pages/Login/Login"));

export const hashHistory = createHashHistory();

export default function App(): ReactElement {
  console.log("APP RENDER");
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
