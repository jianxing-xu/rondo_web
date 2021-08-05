
import { Tooltip, Slider } from 'antd';
import React, { useMemo, useState } from 'react';
import _ from './index.module.css';
import { classNames } from 'utils';
import SvgIcon from 'components/SvgIcon';
import { useGlobalModel } from 'models/globalModel';
import { useAudioModel } from 'models/audioModel';
import { useCoreModel } from 'models/coreModule';

// 播放进度
const MProgress: React.FC = () => {
  const { percent } = useAudioModel();
  return (
    <Tooltip title="进度">
      <div className="absolute left-0 right-0 bg-green-800 top-8 w-ful" style={{ height: 1 }}>
        <div className={classNames(_.process_inner, "bg-green-300 relative")} style={{ width: `${percent}%`, height: 1 }}></div>
      </div>
    </Tooltip>
  );
}


interface IMessageInput {
  onEnter?: (msgVlaue: string) => void;
}
export const MessageInput: React.FC<IMessageInput> = ({ onEnter = () => { } }) => {
  const { changeSettings, volume } = useGlobalModel();
  const { now } = useCoreModel();
  const { currLineLyric } = useAudioModel();
  const [msgVlaue, setMsgVlaue] = useState("");

  // ctrl+enter换行 enter发送
  const handleInputKeyDown = (e: any) => {
    if (e.key == "Enter" && e.ctrlKey) {
      setMsgVlaue(v => v + "\n");
    } else if (e.key == "Enter") {
      e.preventDefault();
      onEnter(msgVlaue);
      setMsgVlaue("");
      return false;
    }
  }

  const iconName = useMemo(() => {
    if (volume <= 0) return "guanbishengyin";
    if (volume > 0 && volume <= 40) return "yinliang1";
    if (volume > 40 && volume < 80) return "zhongdengyinliang";
    return "zuidayinliang";
  }, [volume])
  return (
    <div className="h-32 bg-transparent">
      <div className="relative flex items-center h-8 px-2">
        <Tooltip title="表情">
          <SvgIcon name="biaoqing" className="text-2xl text-icon-normal hover:text-primary" />
        </Tooltip>
        <Tooltip title="图片">
          <SvgIcon name="tupian" className="ml-2 text-2xl text-icon-normal hover:text-primary" />
        </Tooltip>
        <div className="flex items-center ml-auto space-x-2">
          <span className="text-sm">{now?.name ?? ""}</span>
          <span className="text-sm font-bold cursor-pointer select-none" style={{ color: "var(--primary)" }}> {now?.uname ?? ""}</span>
          <Tooltip title="加入到我的歌单">
            <SvgIcon name="fav" className="cursor-pointer text-icon-normal hover:text-primary" />
          </Tooltip>

          <Tooltip title={<div className="h-20 pb-2"><Slider vertical value={parseInt(volume.toString())} onChange={e => { changeSettings("volume", e) }} /></div>}>
            <SvgIcon click={() => changeSettings("muteToggle")} name={iconName} className="text-xl cursor-pointer text-icon-normal hover:text-primary" />
          </Tooltip>

          <Tooltip title="发表不想听态度" placement="topLeft">
            <SvgIcon name="next" className="cursor-pointer text-icon-normal hover:text-primary" />
          </Tooltip>
        </div>
        <MProgress />
      </div>
      <div className="relative h-24">
        <textarea value={msgVlaue} onChange={e => setMsgVlaue(e.target.value)} onKeyDown={e => handleInputKeyDown(e)} className="w-full bg-transparent border-0 outline-none resize-none h-18"></textarea>
        <Tooltip title="点击复制">
          <span className="absolute cursor-pointer bottom-1 left-2" style={{ fontSize: 12 }}>{currLineLyric ?? ""}</span>
        </Tooltip>
        <button onClick={() => onEnter(msgVlaue)} className="absolute px-4 py-2 bg-gray-100 rounded-sm outline-none bottom-2 right-2 dark:bg-gray-500 active:bg-gray-200 dark:active:bg-gray-600">发送(Enter)</button>

      </div>
    </div>
  );
}