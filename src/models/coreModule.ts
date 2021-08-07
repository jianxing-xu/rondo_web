import { message } from "antd";
import { IAtUser, messageList } from "api/message";
import { songLrc } from "api/song";
import { useFetch } from "components/AddSongPanel";
import { createModel } from "hox";
import { useEffect, useMemo, useState } from "react";
import CST, { MT } from "utils/CST";
import { player, useAudioModel } from "./audioModel";
import { useGlobalModel } from "./globalModel";
import { useSocketModel } from "./socketModel";
import { useUserModel } from "./userModel";

// 全部模块初始化 千万申明不能依赖任何数据
export const initModel = () => {
  const sm = useSocketModel(model => []);
  const usr = useUserModel(model => []);
  const sys = useGlobalModel(model => []);
  const au = useAudioModel(model => []);
  const core = useCoreModel(model => []);

  return { core, au, usr, sm, sys };
}

let tryCount = 0;
let tryLrcCount = 0;
const initDialog = {
  SEARCH: false,// "Search", // 搜索
  MY_SONGS: false,// "MySongs", // 我的歌单列表
  ONLINE_LIST: false,// "OnlineList", // 在线用户列表
  WAIT_QUEUE: false,// "WaitQueue", // 等待播放
  PROFILE: false,// "Profile", // 我的信息
  ROOM_CREATE: false,// "RoomCreate", // 创建房间
  ROOM_LIST: false,// "RoomList", // 房间列表
  ROOM_PWD: false,// "RoomPwd", // 输入房间密码
  ROOM_SETTING: false,// "RoomSetting", // 房间设置
};
function coreModule() {
  // 聊天被@的用户
  const [at, setAt] = useState<IAtUser | null>();
  // MainWindow loading状态
  const [globalLoading, setGlobleLoading] = useState(false);
  // 对话框状态
  const [dialog, setDialog] = useState<any>(initDialog);
  const [now, setNow] = useState<any>(); // 当前播放信息
  // 消息列表
  const { loading, data: msgs, setData: setMsgs, fetching: fetchingMsgs } = useFetch(messageList, parseInt(localStorage.getItem("pre_room_id") ?? "888"), { init: false });

  // 隐藏所有对话框
  const hdieAll = () => {
    // 判断一下一面不必要的渲染
    let hide = false;
    for (const p in dialog) {
      if (dialog[p]) {
        hide = true;
        break;
      }
    }
    hide && setDialog({ ...initDialog });
  }
  // 显示其一对话框
  const showDialog = (key: string) => {
    setDialog((dig: any) => {
      if (dig[key]) {
        dig = { ...initDialog };
      } else {
        dig = { ...initDialog };
        dig[key] = true;
      }
      return dig;
    });
  }

  // socket消息控制器
  function messageController(chatMsg: any) {
    const type = chatMsg['type'];
    const data = chatMsg['data'];
    switch (type) {
      case MT.PLAY_SONG:
      case MT.NOW:
        console.log(data);
        const song = data['song'];
        const user = data['user'];
        const url = CST.server_host + "/song/playUrl/" + song['mid'];
        player.src = url;
        setNow({ ...song, uid: user?.user_id, uname: user?.user_name, url, since: data?.since });
        fetchLrc(song.mid);
        break;
      case MT.ONLINE:
        setNow((n: any) => ({ ...n, onlineCount: data?.length || 0 }))
        break;
      // 摸一摸 和 系统消息一起
      case MT.SYSTEM:
      case MT.ADD_SONG:
      case MT.PUSH:
      case MT.JOIN:
      case MT.TOUCH:
      case MT.PASS:
      case MT.SHUT_DOWN:
      case MT.REMOVE_BAN:
        setMsgs((msgs: any[]) => ([...msgs, chatMsg]));
        break;
      case MT.PRE_LOAD_URL: break;
      case MT.TEXT:
        setMsgs((msgs: any[]) => ([...msgs, data]));
        break;
      case MT.BACK:
        const msgId = data['message_id'];
        setMsgs((msgs: any) => {
          return msgs.filter((item: any) => item.message_id != msgId);
        }); break;
      case MT.CLEAR:
        setMsgs([]); break;
      case MT.PRE_LOAD_URL: break; // !!!!LKDfjskfjs///
      case MT.ROOM_UPDATE:
        setMsgs((msgs: any[]) => ([...msgs, chatMsg]));
        const reConnect = data?.reConnect;
        if (reConnect) {
          // 需要重载
          setTimeout(() => {
            location.reload();
          }, 2000)
        }
        break; // coming soon
      default: break;
    }
  }

  // 重新加载url
  function tryPlay() {
    if (!player.paused) {
      console.log("加载歌曲成功");
      tryCount = 0;
      return;
    };
    if (tryCount > 5) {
      console.log("重试了5次还是加载失败");
      return;
    }
    tryCount++;
    console.log(`正在第${tryCount}重试(重新载入url)....`)
    player.src = now['url'] + "?time=" + Date.now();
    player.load();
    setTimeout(() => {
      tryPlay();
    }, 5000)
  }

  // 获取当前播放进度
  function getNowTime(since: any = now?.since ?? Date.now() / 1000) {
    return (Date.now() / 1000) - since;
  }
  const nowTime = useMemo(() => {
    return (Date.now() / 1000) - now?.since ?? 0;
  }, [now])

  // 获取用户信息后连接socket
  function reconnect() {
    const roomId = parseInt(localStorage.getItem("pre_room_id") ?? "888");
    setGlobleLoading(true);
    useUserModel.data?.fetchUserInfo().then((user: any) => { // 用户信息
      useSocketModel.data?.fetchRoomInfo(roomId).then(() => { // 房间信息
        fetchingMsgs(roomId);
        useSocketModel.data?.fetchWebsocketUrl(roomId).then((param) => { // 连接参数
          useSocketModel.data?.setMsgCtrl(param, messageController); // 连接socket
        })
      }).catch(e => { }).finally(() => setGlobleLoading(false));
    }).catch(e => {
      if (e === 403) {
        reconnect();
      }
    }).finally(() => setGlobleLoading(false));
  }
  // 切换房间后重连socket
  function changeRoom(roomId: number) {
    const sd = useSocketModel.data;
    message.success("房间切换中");
    setGlobleLoading(true);
    return new Promise((resolve, reject) => {
      sd?.fetchRoomInfo(roomId).then(roomInfo => {
        fetchingMsgs(roomId);
        sd?.fetchWebsocketUrl(roomId).then(data => {
          sd?.setMsgCtrl(data, messageController);
          localStorage.setItem("pre_room_id", roomId.toString());
          resolve("success")
        });
      }).catch(e => {
        console.error("提示输入密码");
        reject(e);
      }).finally(() => setGlobleLoading(false));
    })
  }


  // 获取歌词 and try
  async function fetchLrc(mid: number) {
    useAudioModel.data?.setLrc([]);
    try {
      const data = await songLrc(mid);
      useAudioModel.data?.setLrc(data)
    } catch (error) {
      if (tryLrcCount > 5) {
        useAudioModel.data?.setLrc([{ lineLyric: "歌词加载失败", time: "0.0" }])
        return;
      }
      tryLrcCount++;
      console.log(`歌词失败第${tryLrcCount}次重试`);
      setTimeout(() => {
        fetchLrc(mid);
      }, 2000)
    }
  }

  // 初始化
  useEffect(() => {
    reconnect();
  }, [])
  return { at, setAt, globalLoading, msgs, setMsgs, now, reconnect, messageController, changeRoom, tryPlay, getNowTime, dialog, hdieAll, showDialog };
}

export const useCoreModel = createModel(coreModule);