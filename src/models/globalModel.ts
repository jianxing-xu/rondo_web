import { message } from "antd";
import { createModel } from "hox";
import { useEffect, useState } from "react";
import { themeChange, setDark as setDarkTheme } from "utils";
import { TOKEN_KEY } from "utils/CST";
import { useSocketModel } from "./socketModel";
import { useUserModel } from "./userModel";





function globalModel() {
  const { getInfo, setUser } = useUserModel();
  const { fetchUrl } = useSocketModel();
  const [notice, setNotice] = useState(localStorage.getItem("notice") ?? 1); // 浏览器开启通知
  const [sound, setSound] = useState(localStorage.getItem("sound") ?? 1); // 声音通知
  const [dark, setDark] = useState(localStorage.getItem("dark") ?? 1); // 深色模式
  const [volume, setVolume] = useState(localStorage.getItem("volume") ?? 50); // 音乐音量
  const [oldVolume, setOldVolulme] = useState(localStorage.getItem("old_volume") ?? 0);

  useEffect(() => {
    localStorage.setItem("notice", notice.toString());
    localStorage.setItem("sound", sound.toString());
    localStorage.setItem("dark", dark.toString());
    localStorage.setItem("volume", volume.toString());
    localStorage.setItem("old_volume", oldVolume.toString());
  }, [notice, sound, dark, volume, oldVolume]);
  useEffect(() => {
    if (dark == 1) {
      setDarkTheme();
    }
  }, [])

  // 成功登录后动作
  function doSuccessLogin(res: any) {
    console.log("DO SUCCESS!!!");
    localStorage.setItem(TOKEN_KEY.ACCESS, res["token"]);
    getInfo().then((u: any) => {
      message.success("登录成功！");
      setUser(u);
      fetchUrl();
    });
  }

  function changeSettings(type: string, ...args: any[]) {
    console.log(type, args);
    switch (type) {
      case "muteToggle":
        if (volume == 0) {
          setVolume(oldVolume);
        } else {
          setOldVolulme(volume);
          setVolume(0);
        }
        break;
      case "volume":
        setVolume(args[0]);
        break;
      case "notice":
        setNotice((v: any) => v == 1 ? 0 : 1); break;
      case "sound":
        setSound((v: any) => v == 1 ? 0 : 1); break;
      case "dark":
        setDark((v: any) => {
          const f = v == 1 ? 0 : 1
          themeChange(f);
          return f;
        }); break;
      default: break;
    }
  }
  return { changeSettings, notice, sound, dark, volume, doSuccessLogin };
}

export const useGlobalModel = createModel(globalModel);