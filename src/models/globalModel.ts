import { createModel } from "hox";
import { useEffect, useState } from "react";
import { themeChange, setDark as setDarkTheme } from "utils";


function globalModel() {
  const [notice, setNotice] = useState(localStorage.getItem("notice") ?? 1); // 浏览器开启通知
  const [sound, setSound] = useState(localStorage.getItem("sound") ?? 1); // 声音通知
  const [dark, setDark] = useState(localStorage.getItem("dark") ?? 1); // 深色模式

  useEffect(() => {
    localStorage.setItem("notice", notice.toString());
    localStorage.setItem("sound", sound.toString());
    localStorage.setItem("dark", dark.toString());
  }, [notice, sound, dark]);
  useEffect(() => {
    if (dark == 1) {
      setDarkTheme();
    }
  }, [])

  function changeSettings(type: string) {
    switch (type) {
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
  return { changeSettings, notice, sound, dark };
}

export const useGlobalModel = createModel(globalModel);