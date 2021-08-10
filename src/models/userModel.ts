import { message } from "antd";
import { myInfo } from "api/user";
import { createModel } from "hox";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CST, { TOKEN_KEY } from "utils/CST";
import { useCoreModel } from "./coreModule";
import { useSocketModel } from "./socketModel";

interface IUser {
  room?: null,
  admin?: boolean;// true,
  role?: number;// 1,
  user_account?: string;// "admin@rondo.com",
  user_app?: number;// 1,
  user_createtime?: number;// 0,
  user_device?: string;// "iPhone",
  user_extra?: string;// "",
  user_group?: number;// 1,
  user_head?: string;// "/res/new/images/nohead.jpg",
  user_icon?: number;// 1,
  user_id?: number;// 1,
  user_ipreg?: string;// "127.0.0.1",
  user_name?: string;// "机器人",
  user_openid?: string;// "",
  user_remark?: string;// "别@我,我只是个测试号",
  user_role?: number;// 1,
  user_salt?: string;// "zXZy",
  user_sex?: number;// 0,
  user_status?: number;// 0,
  user_touchtip?: string;// "别爱我，没结果，我只是机器人",
  user_updatetime?: string;// 1605004436,
  user_vip?: number;// 0,
  vip?: string;// false
}
const userModel = () => {
  const [user, setUser] = useState<IUser>({ ...CST.guestUserInfo });
  const [u, su] = useState<number | null>(null); // 查看其他用户信息的id

  // 获取我的信息
  async function fetchUserInfo() {
    const data = await myInfo();
    setUser(data);
    return data;
  }

  // 重置用户信息
  function resetUser() {
    localStorage.removeItem(TOKEN_KEY.ACCESS);
    setUser({ ...CST.guestUserInfo });
  }

  function logout() {
    resetUser();
    useCoreModel.data?.hdieAll();
    useCoreModel.data?.reconnect();
  }

  return {
    user, fetchUserInfo, resetUser, u, su, setUser, logout
  }
}

export const useUserModel = createModel(userModel);