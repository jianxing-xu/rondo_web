// import Head from "components/Head";
import Head from "components/Head";
import LoadingOrError from "components/LoadingOrError";
import { initModel } from "models/coreModule";
import React, { lazy, ReactElement, Suspense, useEffect, useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

const MainWindow = lazy(() => import("./pages/MainWindow"));
const Login = lazy(() => import("./pages/Login/Login"));



export default function App(): ReactElement {
  console.log("APP RENDER");
  initModel();
  return (
    <>
      <Head title="App" />
      <HashRouter>
        <Suspense fallback={<LoadingOrError />}>
          <Switch>
            <Route exact path="/" component={MainWindow} />
            <Route path="/login" component={Login} />
          </Switch>
        </Suspense>
      </HashRouter>
    </>
  );
}
