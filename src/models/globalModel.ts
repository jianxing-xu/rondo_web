import { createModel } from "hox";
import { useEffect, useReducer } from "react";
import { themeChange, setDark as setDarkTheme, local } from "utils";
import { player } from "./audioModel";

/** 系统配置模块 */
interface IInitState {
  notice: number;
  sound: number;
  dark: number;
  volume: number;
  oldVolume: number;
}
const initState = {
  notice: local.get("notice", 1),
  sound: local.get("sound", 1),
  dark: local.get("dark", 1),
  volume: local.get("volume", 50),
  oldVolume: local.get("old_volume", 0),
};
const GReducer = (state: IInitState, action: { type: string; data: any }) => {
  const { type, data } = action;
  const { volume, oldVolume, notice, sound, dark } = state;
  switch (type) {
    case "muteToggle":
      const newState: any = {};
      if (volume == 0) {
        newState["volume"] = oldVolume;
        player.volume = oldVolume / 100;
      } else {
        newState["oldVolume"] = volume;
        newState["volume"] = 0;
        player.volume = 0;
      }
      return { ...state, ...newState };
    case "volume":
      player.volume = data[0] / 100;
      return { ...state, volume: data[0] };
    case "notice":
      return { ...state, notice: notice == 1 ? 0 : 1 };
    case "sound":
      return { ...state, sound: sound == 1 ? 0 : 1 };
    case "dark":
      const isDark = dark == 1 ? 0 : 1;
      themeChange(isDark);
      return { ...state, dark: isDark };
    default:
      return state;
  }
};
function globalModel() {
  const [state, dispatch] = useReducer(GReducer, initState);
  useEffect(() => {
    local.set("notice", state.notice);
    local.set("notice", state.notice);
    local.set("sound", state.sound);
    local.set("dark", state.dark);
    local.set("volume", state.volume);
    local.set("old_volume", state.oldVolume);
  }, [state]);
  useEffect(() => {
    if (state.dark == 1) {
      setDarkTheme();
    }
  }, []);

  function changeSettings(type: string, ...args: any[]) {
    dispatch({ type, data: args });
  }
  return { changeSettings, ...state };
}
export const useGlobalModel = createModel(globalModel);
