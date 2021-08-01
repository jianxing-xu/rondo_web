/**
 * 请求封装
 * @auther jason xu
 * @lastUpdate 2020/7/30
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useUserModel } from 'models/userModel';
import { message } from 'antd';
import CST, { TOKEN_KEY } from 'utils/CST';
import { log } from 'utils/LoggerUtil';


const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://49.235.175.45/rondo/api/"
      : "http://localhost:8080/api",
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY.ACCESS);
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
    const code = response.data["data"]["code"];
    return response.data;
  },
  err => {
    log.err("Response.ts:==INFO==: Response Error!", err);
    if (err && err.response && err.response.data) {
      const status = err.response.status;
      const myStatus = err.response.data["code"];
      const msg = err.response.data["msg"];
      console.log(status, myStatus, msg);
      switch (status) {
        case 400:
          message.error(msg || "响应错误"); return Promise.reject(msg);
        case 403:
          message.error(msg || "登录过期");
          useUserModel.data?.resetUser(); return Promise.reject(msg);
        case 500:
          message.error(msg || "系统错误"); return Promise.reject(msg);;
      }
    }
  }
);



export default instance;

