import App from "App";
import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { getConfig } from "api/common";

getConfig("iconfont-source-cdn").then((link: string) => {
  const script = document.createElement("script");
  script.src = link;
  document.head.append(script);
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector("#root")
);
