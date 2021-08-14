import { Modal } from "antd";
import Head from "components/Head";
import LoadingOrError from "components/LoadingOrError";
import { player } from "models/audioModel";
import React, { lazy, ReactElement, Suspense, useEffect } from "react";
import { Route, Router, Switch } from "react-router-dom";
import { createHashHistory } from "history";
import { useCoreModel } from "models/coreModule";

const MainWindow = lazy(() => import("./pages/MainWindow"));
const Login = lazy(() => import("./pages/Login/Login"));

export const hashHistory = createHashHistory();

export default function App(): ReactElement {
  console.log("APP RENDER");
  // useCoreModel(m => []);
  return (
    <>
      <Head title="App" />
      <Router history={hashHistory}>
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
