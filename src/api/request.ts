/**
 * 请求封装
 * @auther jason xu
 * @lastUpdate 2020/7/30
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Alert } from 'rsuite';
import CST from 'utils/CST';
import { log } from 'utils/LoggerUtil';


const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://49.235.175.45/blogapi/api/"
      : "http://localhost:8080/api",
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("rondo-token");
    config.headers["token"] = token ?? CST.visitorToken;
    return config;
  },
  err => {
    log.err("Request.ts:==INFO==: Request Error!", err);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status == 200 && response.data['code'] == 1000) {
      return response.data['data'];
    }
    return response.data;
  },
  err => {
    log.err("Response.ts:==INFO==: Response Error!", err);
    if (err && err.response && err.response.data) {
      const status = err.response.status;
      const myStatus = err.response.data["code"];
      const msg = err.response.data["msg"];

      switch (status) {
        case 400:
          log.err("响应错误");
          Alert.error(msg || "响应错误");
      }
    }
  }
);



export default instance;

