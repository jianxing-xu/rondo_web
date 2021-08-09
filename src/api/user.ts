/**
 * 用户api
 * @auther jason xu
 * @lastUpdate 2020/7/30
 */


import instance from "./request";

/** 登录 */
interface ILoginParam {
  account: string;
  password: string; // 利用验证码登录时，验证码用此字段传递
  plat: string;
}
export const login = (data: ILoginParam): Promise<any> => {
  return instance.post("/user/login", data);
}
export const loginAdmin = (data: ILoginParam): Promise<any> => {
  return instance.post("/user/admin/login", data);
}


/** 我的信息,只需要token即可 */
export const myInfo = (): Promise<any> => {
  return instance.post("/user/info");
}

/** 其他用户信息 */
export const userInfo = (userId: number): Promise<any> => {
  return instance.get(`/user/user_info/${userId}`);
}

/** 更新用户信息 */
interface IUpdateUserParam {
  userHead: string;
  userName: string;
  userRemark: string;
  userTouchTip: string;
  userSex: number; // 0 / 1
  userPassword: string;
}
export const updateUser = (data: IUpdateUserParam): Promise<any> => {
  return instance.post("/user/update");
}
/** 更新密码 */
export const updatePwd = (old: string, newPwd: string): Promise<any> => {
  return instance.post("/user/pwd/update", { old, new: newPwd });
}
/** 重置密码 */
export const resetPwd = (code: string, mail: string, pwd: string): Promise<any> => {
  return instance.post("/user/pwd/reset", { code, mail, pwd });
}

/** 禁言/禁止点歌 type:0 禁言  1: 禁止点歌 */
export const shutdown = (type: number, roomId: number, banId: number): Promise<any> => {
  return instance.post(`/user/shutdown/${type}/${roomId}/${banId}`);
}

/** 解除禁言/禁止点歌*/
export const removeBan = (roomId: number, banId: number): Promise<any> => {
  return instance.post(`/user/removeBan/${roomId}/${banId}`);
}

/** 获取在线用户 */
interface IOnline {
  roomId: number;
  sync?: string;
}
export const online = ({ roomId, sync = "yes" }: IOnline = { roomId: 888, sync: "yes" }): Promise<any> => {
  return instance.get(`/user/online/${roomId}/${sync}`);
}







