import { Tooltip, Slider, message, Upload, Modal } from "antd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import _ from "./index.module.css";
import { classNames, debounce, insertHtml, uuid } from "utils";
import SvgIcon from "components/SvgIcon";
import { useGlobalModel } from "models/globalModel";
import { useAudioModel } from "models/audioModel";
import { useCoreModel, UActionType } from "models/coreModule";
import { favSong, passSong, removeFav, reqIsFav } from "api/song";
import { send } from "api/message";
import CST, { POPKEY } from "utils/CST";
import { uploadImg } from "api/attach";

// 播放进度
const MProgress: React.FC = () => {
  const { percent } = useAudioModel((model) => [model.percent]);
  return (
    <Tooltip title="进度">
      <div
        className="absolute left-0 right-0 top-8 w-ful"
        style={{ height: 1 }}
      >
        <div
          className={classNames(_.process_inner, "bg-primary relative")}
          style={{ width: `${percent}%`, height: 1 }}
        ></div>
      </div>
    </Tooltip>
  );
};

// 歌词行
const Lyricline: React.FC = () => {
  const { currLineLyric } = useAudioModel((model) => [model.currLineLyric]);
  return (
    <span
      className="absolute cursor-pointer bottom-1 left-2"
      style={{ fontSize: 12 }}
    >
      {currLineLyric ?? ""}
    </span>
  );
};

// 表情
const Phiz: React.FC<{ putChar?: Function }> = ({ putChar = () => {} }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute flex flex-col p-2 rounded-lg shadow-md left-6 bg-chat"
      style={{ height: "19rem", width: 387, top: "-19rem" }}
    >
      <div className="flex flex-wrap flex-grow overflow-y-scroll m_scroll">
        {new Array(30).fill("", 0, 30).map((e, i) => {
          return (
            <img
              onClick={() =>
                putChar(CST.static_url + `/res/images/emoji/${i + 1}.png`)
              }
              className="w-12 h-12 mt-2 ml-2 cursor-pointer"
              key={i}
              src={CST.static_url + `/res/images/emoji/${i + 1}.png`}
              alt=""
            />
          );
        })}
      </div>
    </div>
  );
};

interface IMessageInput {
  onEnter?: (msgVlaue: string) => void;
}
export const MessageInput: React.FC<IMessageInput> = ({
  onEnter = () => {},
}) => {
  const [isFav, setFav] = useState(false);
  const { changeSettings, volume } = useGlobalModel((m) => [m.volume]);
  const { now, at, setAt, setMsgs, showDialog, user } = useCoreModel((m) => [
    m.now,
    m.at,
    m.user,
  ]);
  const textRef = useRef<HTMLInputElement | any>();
  // ctrl+enter换行 enter发送
  const handleInputKeyDown = (e: any) => {
    if (e.key == "Enter" && e.ctrlKey) {
      showDialog(POPKEY.SEARCH);
      return false;
    } else if (e.key == "Enter") {
      e.preventDefault();
      popmsg();
      return false;
    }
  };

  const popmsg = () => {
    const value = textRef.current.value;
    if (!!!value || !!!value?.trim()) return;
    onEnter(value);
    handleSend(value);
    textRef.current.value = "";
  };
  const handlePass = () => {
    if (!now.mid) return message.info("暂无正在播放歌曲");
    passSong({ mid: now.mid, room_id: useCoreModel.data?.roomId })
      .then(() => {})
      .catch((e) => {});
  };
  const handleFav = useCallback(
    debounce(
      () => {
        if (!now?.mid) return message.info("暂无正在播放歌曲");
        if (!isFav) {
          favSong(now.mid, useCoreModel.data?.roomId)
            .then(() => {})
            .catch((e) => {
              if (e === 1001) {
                setFav(true);
              }
            });
        } else {
          removeFav(now.mid)
            .then(() => {
              setFav(false);
              message.info("取消收藏成功");
            })
            .catch(() => {});
        }
      },
      300,
      false
    ),
    [isFav, now?.mid]
  );
  const handleSend = (value: string, type = "text") => {
    if (!!!value?.trim()) return;
    const msgParam = {
      loading: true,
      room_id: useCoreModel.data?.roomId,
      type,
      resource: value,
      msg: value,
      where: "channel",
      atUser: at,
    };
    const tempMsg = {
      message_content: value,
      message_createtime: Date.now() / 1000,
      message_id: uuid(),
      message_resource: value,
      message_status: 0,
      message_type: type,
      message_user: useCoreModel.data?.user?.user_id,
      message_where: "channel",
      loading: true,
      user: useCoreModel.data?.user,
    };
    setMsgs((msgs: any[]) => [...msgs, tempMsg]);

    send(msgParam)
      .then(() => {})
      .catch((e) => {
        // 发生错误时撤回消息
        setMsgs((msgs: any[]) => msgs.filter((item: any) => !item.loading));
      })
      .finally(() => {});
    setAt(null);
  };

  useEffect(() => {
    if (!!at && at?.user_name?.trim() && at.type == 1) {
      textRef.current.value += `@${at?.user_name} `;
    }
  }, [at]);

  const iconName = useMemo(() => {
    if (volume <= 0) return "guanbishengyin";
    if (volume > 0 && volume <= 40) return "yinliang1";
    if (volume > 40 && volume < 80) return "zhongdengyinliang";
    return "zuidayinliang";
  }, [volume]);

  const [pshow, setPshow] = useState(false);
  const hide = () => {
    setPshow(false);
  };
  useEffect(() => {
    //表情隐藏失败
    document.body.addEventListener("click", hide, false);
    return () => document.body.removeEventListener("click", hide, false);
  }, []);

  useEffect(() => {
    if (user?.user_id == -1 || !!!now) return;
    reqIsFav(now?.mid)
      .then((res) => {
        setFav(res);
      })
      .catch((e) => {});
  }, [now, user]);

  const handleUpload = (e: any) => {
    const hide = message.loading("上传中...");
    if (["image/jpeg", "image/png", "image/gif"].includes(e?.file?.type)) {
      uploadImg({ file: e.file, type: "1" })
        .then((res: any) => {
          const path = CST.static_url + res.attach_path;
          Modal.confirm({
            title: "确定发送图片吗？",
            content: <img src={path} alt="" />,
            onOk() {
              handleSend(path, "img");
            },
          });
        })
        .finally(() => hide());
    } else {
      message.error("文件类型不匹配");
    }
  };
  return (
    <div className="h-32 bg-transparent">
      <div className="relative flex items-center h-8 px-2">
        {pshow ? <Phiz putChar={(v: any) => handleSend(v, "img")} /> : null}
        <div className="flex gap-2">
          <SvgIcon
            stop={true}
            click={() => setPshow((p) => !p)}
            name="biaoqing"
            className="text-2xl text-icon hover:text-primary"
          />
          <Upload showUploadList={false} customRequest={handleUpload}>
            <SvgIcon
              name="tupian"
              className="text-2xl text-icon hover:text-primary"
            />
          </Upload>
        </div>
        <div className="flex items-center ml-auto space-x-2">
          <span className="text-sm">
            {now?.name ?? "--"}({now?.singer ?? "--"})
          </span>
          <span
            onClick={() => {
              useCoreModel.data?.udsp({ type: UActionType.SU, data: now?.uid });
              showDialog(POPKEY.PROFILE);
            }}
            className="text-sm font-bold cursor-pointer select-none"
            style={{ color: "var(--primary)" }}
          >
            {" "}
            {now?.uname ?? ""}
          </span>
          <SvgIcon
            click={handleFav}
            name="fav"
            className={`cursor-pointer ${
              isFav ? "text-primary" : "text-icon-normal"
            } hover:text-primary`}
          />

          <Tooltip
            title={
              <div className="h-20 pb-2">
                <Slider
                  vertical
                  value={parseInt(volume.toString())}
                  onChange={(e) => {
                    changeSettings("volume", e);
                  }}
                />
              </div>
            }
          >
            <SvgIcon
              click={() => changeSettings("muteToggle")}
              name={iconName}
              className="text-xl cursor-pointer text-icon-normal hover:text-primary"
            />
          </Tooltip>

          <Tooltip title="发表不想听态度" placement="topLeft">
            <span onClick={handlePass}>
              <SvgIcon
                name="next"
                className="cursor-pointer text-icon-normal hover:text-primary"
              />
            </span>
          </Tooltip>
        </div>
        <MProgress />
      </div>
      <div className="relative h-24">
        <textarea
          ref={textRef}
          onKeyDown={(e) => handleInputKeyDown(e)}
          className={classNames(
            "w-full bg-transparent border-0 outline-none resize-none h-18 box-border pl-2 pt-2 overflow-y-scroll m_scroll",
            _.input
          )}
        ></textarea>
        <Tooltip title="点击复制">
          <Lyricline />
        </Tooltip>
        <button
          onClick={popmsg}
          className="absolute px-4 py-2 bg-gray-100 rounded shadow-inner outline-none bottom-2 right-2 dark:bg-gray-500 active:bg-gray-200 dark:active:bg-gray-600"
        >
          发送(Enter)
        </button>
      </div>
    </div>
  );
};
