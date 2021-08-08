
import { Tooltip, Slider, message } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import _ from './index.module.css';
import { classNames, uuid } from 'utils';
import SvgIcon from 'components/SvgIcon';
import { useGlobalModel } from 'models/globalModel';
import { useAudioModel } from 'models/audioModel';
import { useCoreModel } from 'models/coreModule';
import { favSong, passSong } from 'api/song';
import { useSocketModel } from 'models/socketModel';
import { send } from 'api/message';
import { useUserModel } from 'models/userModel';

// 播放进度
const MProgress: React.FC = () => {
  const { percent } = useAudioModel(model => [model.percent]);
  return (
    <Tooltip title="进度">
      <div className="absolute left-0 right-0 bg-green-800 top-8 w-ful" style={{ height: 1 }}>
        <div className={classNames(_.process_inner, "bg-green-300 relative")} style={{ width: `${percent}%`, height: 1 }}></div>
      </div>
    </Tooltip>
  );
}

// 歌词行
const Lyricline: React.FC = () => {
  const { currLineLyric } = useAudioModel(model => [model.currLineLyric]);
  return (
    <span className="absolute cursor-pointer bottom-1 left-2" style={{ fontSize: 12 }}>{currLineLyric ?? ""}</span>
  )
}


interface IMessageInput {
  onEnter?: (msgVlaue: string) => void;
}
export const MessageInput: React.FC<IMessageInput> = ({ onEnter = () => { } }) => {
  const { changeSettings, volume } = useGlobalModel(model => [model.volume]);
  const { room } = useSocketModel(model => [model.room])
  const { now, at, setAt, setMsgs } = useCoreModel(model => [model.now, model.at]);
  const textRef = useRef<HTMLInputElement | any>();

  // ctrl+enter换行 enter发送
  const handleInputKeyDown = (e: any) => {
    if (e.key == "Enter" && e.ctrlKey) {
      e.target.value += "\n";
    } else if (e.key == "Enter") {
      e.preventDefault();
      popmsg();
      return false;
    }
  }

  const popmsg = () => {
    const value = textRef.current.value;
    if (!!!value || !!!value?.trim()) return;
    onEnter(textRef.current.value);
    handleSend(value);
    textRef.current.value = "";
  }
  const handlePass = () => {
    if (!now.mid) return message.info("暂无正在播放歌曲");
    passSong({ mid: now.mid, room_id: room['room']?.room_id }).then(() => { }).catch(e => { });
  }
  const handleFav = () => {
    if (!now.mid) return message.info("暂无正在播放歌曲");
    favSong(now.mid, room['room']?.room_id)
  }
  const handleSend = (value: string) => {
    const msgParam = { loading: true, room_id: room['room']?.room_id, type: "text", resource: value, msg: value, where: "channel", atUser: at };
    const tempMsg = {
      message_content: value,
      message_createtime: Date.now() / 1000,
      message_id: uuid(),
      message_resource: value,
      message_status: 0,
      message_type: "text",
      message_user: useUserModel.data?.user?.user_id,
      message_where: "channel",
      loading: true,
      user: useUserModel.data?.user
    }
    setMsgs((msgs: [any]) => ([...msgs, tempMsg]))

    send(msgParam)
      .then(() => {
      }).catch(e => {
      }).finally(() => {
        setMsgs((msgs: [any]) => {
          return msgs.filter((msg: any) => !msg.loading);
        })
      })
    setAt(null);
  }

  useEffect(() => {
    if (!!at && at?.user_name?.trim() && at.type == 1) {
      textRef.current.value += `@${at?.user_name} `;
    }
  }, [at])

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
        <div>{ }</div>
        <div className="flex items-center ml-auto space-x-2">
          <span className="text-sm">{now?.name ?? ""}</span>
          <span className="text-sm font-bold cursor-pointer select-none" style={{ color: "var(--primary)" }}> {now?.uname ?? ""}</span>
          <Tooltip title="加入到我的歌单">
            <SvgIcon click={handleFav} name="fav" className="cursor-pointer text-icon-normal hover:text-primary" />
          </Tooltip>

          <Tooltip title={<div className="h-20 pb-2"><Slider vertical value={parseInt(volume.toString())} onChange={e => { changeSettings("volume", e) }} /></div>}>
            <SvgIcon click={() => changeSettings("muteToggle")} name={iconName} className="text-xl cursor-pointer text-icon-normal hover:text-primary" />
          </Tooltip>

          <Tooltip title="发表不想听态度" placement="topLeft">
            <span onClick={handlePass}><SvgIcon name="next" className="cursor-pointer text-icon-normal hover:text-primary" /></span>
          </Tooltip>
        </div>
        <MProgress />
      </div>
      <div className="relative h-24">
        <textarea ref={textRef} onKeyDown={e => handleInputKeyDown(e)} className={classNames("w-full bg-transparent border-0 outline-none resize-none h-18", _.input)}></textarea>
        <Tooltip title="点击复制">
          <Lyricline />
        </Tooltip>
        <button onClick={popmsg} className="absolute px-4 py-2 bg-gray-100 rounded-sm outline-none bottom-2 right-2 dark:bg-gray-500 active:bg-gray-200 dark:active:bg-gray-600">发送(Enter)</button>

      </div>
    </div>
  );
}