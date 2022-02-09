import { useAudioModel } from "models/audioModel";
import { useCoreModel } from "models/coreModule";
import _ from "./index.module.css";
import React, { useEffect, useRef } from "react";
import { classNames } from "utils";

interface IProps {
  show?: Boolean;
  onMove?: () => void;
}
export const ImmersivePreview: React.FC<IProps> = ({
  show = false,
  onMove,
}) => {
  const { lrc, curIndex } = useAudioModel((m) => [m.lrc, m.curIndex]);
  const { now } = useCoreModel((m) => [m.now]);
  const lyricRef = useRef<HTMLUListElement | any>();
  useEffect(() => {
    const height = curIndex * 50;
    lyricRef.current?.scrollTo(0, height - 50);
    // lyricRef.current && (lyricRef.current.style.transform = `translateY(${0 - height + 50}px)`)
  }, [curIndex]);
  return (
    <div
      className={classNames(_.immersive, show ? _.show : "")}
      onMouseMove={onMove}
    >
      <div className={classNames("flex items-center", _.immersive_box)}>
        <div className={_.immersive_box_left}>
          <img src={now?.pic} className={_.pic} />
          <p className="songname">歌名: {now?.name}</p>
          <p className="singer">歌手: {now?.singer}</p>
          <p className="addname">点歌人: {now?.uname}</p>
        </div>
        <div className={_.lyric} ref={lyricRef}>
          <ul>
            {lrc.map((it, index) => (
              <li
                key={index}
                className={classNames(
                  _.lyric_item,
                  curIndex === index ? _.active : ""
                )}
              >
                {it.lineLyric}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
