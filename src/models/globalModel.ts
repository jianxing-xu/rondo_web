import { message } from "antd";
import { createModel } from "hox";
import { useEffect, useState } from "react";
import { themeChange, setDark as setDarkTheme } from "utils";
import { TOKEN_KEY } from "utils/CST";
import { player } from "./audioModel";




/** 系统配置模块 */
function globalModel() {
  const [notice, setNotice] = useState(localStorage.getItem("notice") ?? 1); // 浏览器开启通知
  const [sound, setSound] = useState(localStorage.getItem("sound") ?? 1); // 声音通知
  const [dark, setDark] = useState(localStorage.getItem("dark") ?? 1); // 深色模式
  const [volume, setVolume] = useState<any>(localStorage.getItem("volume") ?? 50); // 音乐音量
  const [oldVolume, setOldVolulme] = useState<any>(localStorage.getItem("old_volume") ?? 0);

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


  function changeSettings(type: string, ...args: any[]) {
    switch (type) {
      case "muteToggle":
        if (volume == 0) {
          setVolume(oldVolume);
          player.volume = (oldVolume / 100)
        } else {
          setOldVolulme(volume);
          setVolume(0);
          player.volume = 0
        }

        break;
      case "volume":
        setVolume(args[0]);
        player.volume = args[0] / 100;
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
  return { changeSettings, notice, sound, dark, volume };
}

export const useGlobalModel = createModel(globalModel);