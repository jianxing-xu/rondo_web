import { myInfo } from "api/user";
import { createModel } from "hox";
import { useEffect, useState } from "react";
import CST from "utils/CST";
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
  const sm = useSocketModel();

  useEffect(() => {
    getInfo().then(() => {
      sm.fetchUrl();
    })
  }, [])

  // 获取我的信息
  async function getInfo() {
    const data = await myInfo()
    setUser(data);
  }


  return {
    user, getInfo
  }
}

export const useUserModel = createModel(userModel);