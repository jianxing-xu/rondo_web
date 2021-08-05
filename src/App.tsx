import Head from "components/Head";
import LoadingOrError from "components/LoadingOrError";
import { player } from "models/audioModel";
import React, { lazy, ReactElement, Suspense, useEffect } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Modal } from 'antd';
import { initModel } from "models/coreModule";

const MainWindow = lazy(() => import("./pages/MainWindow"));
const Login = lazy(() => import("./pages/Login/Login"));


export default function App(): ReactElement {
  const { core } = initModel();
  useEffect(() => {
    Modal.info({
      content: "欢迎光临！",
      async onOk() {
        player.play();
      }
    });
  }, []);

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
