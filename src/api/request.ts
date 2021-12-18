/**
 * 请求封装
 * @auther jason xu
 * @lastUpdate 2021/7/30
 */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { message, Modal } from "antd";
import CST, { TOKEN_KEY } from "utils/CST";
import { log } from "utils/LoggerUtil";
import { local } from "utils";
import { hashHistory } from "App";
import React from "react";

// const instance = axios.create({
//   baseURL:
//     process.env.NODE_ENV === "production"
//       ? "http://106.15.137.156:8899/api/"
//       : "http://127.0.0.1:8080/api/",
// });
// const instance = axios.create({
//   baseURL: "http://106.15.137.156:8899/api/",
// });
const instance = axios.create({
  baseURL: "http://127.0.0.1:8080/api/",
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers["token"] = local.get(TOKEN_KEY.ACCESS, CST.visitorToken);
    return config;
  },
  (err) => {
    log.err("Request.ts:==INFO==: Request Error!", err);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status == 200) {
      const data = response.data;
      switch (data["code"]) {
        case 5005:
          message.info(data["msg"]);
          return Promise.reject();
        case 1020:
          message.info(data["msg"] || "歌曲已经在队列中了！");
          return Promise.reject(data["msg"]);
        // 需要提示的成功消息
        case 1001:
          message.success(data["msg"]);
          return Promise.reject(1001);
        default:
          break;
      }
      if (response.status == 200 && response.data["code"] == 1000) {
        const data = response.data["data"];
        if (data && data["token"]) {
          local.set(TOKEN_KEY.ACCESS, data["token"]);
        }
        return data;
      }
    }

    return response.data;
  },
  (err) => {
    log.err("Response.ts:==INFO==: Response Error!");
    if (err && err.response && err.response.data) {
      const status = err.response.status;
      const myStatus = err.response.data["code"];
      const msg = err.response.data["msg"];
      // console.log(status, myStatus, msg);
      switch (status) {
        case 400:
          switch (myStatus) {
            case 1054:
              return Promise.reject(msg);
            case 1012:
              return Promise.reject(msg);
            case 1039:
              return Promise.reject(myStatus); //需要输入房间密码
            case 1139:
              return Promise.reject(myStatus); //房间密码错误
            case 1004:
              localStorage.removeItem(TOKEN_KEY.ACCESS);
              return Promise.reject(myStatus);
            case 1055:
              Modal.confirm({
                title: React.createElement(
                  "div",
                  { style: { color: "var(--font-normal)" } },
                  "无权访问"
                ),
                onOk() {
                  hashHistory.push("/login");
                },
                okText: "去登录",
                cancelText: "取消",
              });
              return Promise.reject(myStatus); // 对游客禁止的操作
            case 1008:
              message.error("游客禁止访问");
              return Promise.reject(myStatus); //游客不允许获取加密房间信息
            default:
              message.error(msg || "响应错误");
              return Promise.reject(msg);
          }
        case 403:
          localStorage.removeItem(TOKEN_KEY.ACCESS);
          // setTimeout(() => {
          // useCoreModel.data?.reconnect();
          // }, 100)
          return Promise.reject(status);
        case 500:
          message.error(msg || "系统错误");
          return Promise.reject(msg);
      }
    }
  }
);

export default instance;
