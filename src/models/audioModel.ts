import { createModel } from "hox";
import { Modal } from 'antd';
import { useEffect, useMemo, useState } from "react";
import { useCoreModel } from "./coreModule";

export interface ILyric {
  lineLyric: string, time: string
}
export const player = new Audio();
player.autoplay = true;
player.volume = parseInt(localStorage.getItem("volume") || "50") / 100;
function audioModel() {
  const [percent, setPercent] = useState(0);
  const [lrc, setLrc] = useState<ILyric[]>([]);
  const [curIdx, setCurIdx] = useState(0);

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
        setCurIdx(lrc.length - 1);
      }
    })
    return lrc[idxLine]?.lineLyric;
  }, [lrc, percent])

  function handlePlay() {
    const curTime = player.currentTime;
    const p = (curTime / player.duration) * 100;
    setPercent(p);
  }
  useEffect(() => {
    player.addEventListener("timeupdate", handlePlay, false);
    player.onplaying = () => {
      console.log("playing");
    }
    // 可以播放了
    player.oncanplay = () => {
      // player.play();
      // setCurrent(useCoreModel?.data?.getNowTime());
    }
    // 加载出错
    player.onerror = (err) => {
      console.log("播放出错，准备重试...");
      console.log(err);
      useCoreModel.data?.tryPlay();
    }
    // 元数据加载完成
    player.onloadedmetadata = () => {
      setCurrent(useCoreModel?.data?.getNowTime());
    }
    player.onloadeddata = () => {
      setCurrent(useCoreModel?.data?.getNowTime());
    }
    return () => {
      player.removeEventListener("timeupdate", handlePlay, false);
      player.pause();
    }
  }, []);
  function setCurrent(time: any) {
    player.currentTime = time;
  }

  return { setCurrent, percent, setLrc, currLineLyric }
}

export const useAudioModel = createModel(audioModel);