import { createModel } from "hox";
import { useEffect, useMemo, useState } from "react";
import { throttle } from "utils";
import { useCoreModel } from "./coreModule";

export interface ILyric {
  lineLyric: string;
  time: string;
}
export const noticePlayer = new Audio("sqy.mp3"); //消息提示播放器
noticePlayer.load();
export const preloadPlayer = new Audio(); // 预加载播放器 只加载资源
export const player = new Audio(); // 主音乐播放器
player.autoplay = true;
player.volume = parseInt(localStorage.getItem("volume") || "50") / 100;
function audioModel() {
  const [percent, setPercent] = useState(0);
  const [curIndex, setCurIndex] = useState(0);
  const [lrc, setLrc] = useState<ILyric[]>([]);

  // 当前播放歌词行
  const currLineLyric = useMemo(() => {
    let idxLine = 0;
    const curTime = player.currentTime + 0.5;
    lrc?.some((item: ILyric, idx: number) => {
      const time = parseInt(item.time);
      let nextTime: any = lrc[idx + 1]?.time;
      if (!nextTime) {
        nextTime = time;
      }
      if (curTime >= time && curTime <= nextTime) {
        idxLine = idx;
        return true;
      } else {
        idxLine = lrc.length - 1;
      }
    });
    setCurIndex(idxLine);
    return lrc[idxLine]?.lineLyric;
  }, [lrc, percent]);

  function handlePlay() {
    const curTime = player.currentTime;
    const p = (curTime / player.duration) * 100;
    setPercent(p);
  }
  useEffect(() => {
    player.addEventListener("timeupdate", throttle(handlePlay, 1000), false);
    // player.onplaying = () => {
    //   console.log("playing");
    // };
    // 可以播放了
    // player.oncanplay = () => {
    //   // player.play();
    //   // setCurrent(useCoreModel?.data?.getNowTime());
    // }
    // 加载出错
    player.onerror = (err) => {
      console.log("播放出错，准备重试...");
      console.log(err);
      useCoreModel.data?.tryPlay();
    };
    // 元数据加载完成
    player.onloadedmetadata = () => {
      // console.log(useCoreModel?.data?.getNowTime());
      setCurrent(useCoreModel?.data?.getNowTime());
    };
    player.onloadeddata = () => {
      // console.log(useCoreModel?.data?.getNowTime());
      setCurrent(useCoreModel?.data?.getNowTime());
    };
    return () => {
      player.removeEventListener("timeupdate", handlePlay, false);
      player.pause();
    };
  }, []);
  function setCurrent(time: any) {
    player.currentTime = time;
  }

  return { setCurrent, percent, setLrc, currLineLyric, lrc, curIndex };
}

export const useAudioModel = createModel(audioModel);
