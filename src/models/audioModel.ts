import { createModel } from "hox";
import { useEffect, useRef, useState } from "react";

export const player = new Audio();
player.autoplay = true;
function audioModel() {
  const [percent, setPercent] = useState(0);

  function handlePlay() {
    const p = (player.currentTime / player.duration) * 100;
    setPercent(p);
  }
  useEffect(() => {
    player.addEventListener("timeupdate", handlePlay, false);
    return () => {
      player.removeEventListener("timeupdate", handlePlay, false);
      player.pause();
    }
  }, []);
  function setCurrent(time: any) {
    player.currentTime = time;
  }

  return { setCurrent, percent }
}

export const useAudioModel = createModel(audioModel);