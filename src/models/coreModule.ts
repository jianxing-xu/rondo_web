import { message } from "antd";
import { songLrc } from "api/song";
import { createModel } from "hox";
import { useEffect, useState } from "react";
import CST, { MT, POPKEY } from "utils/CST";
import { player, useAudioModel } from "./audioModel";
import { useGlobalModel } from "./globalModel";
import { useSocketModel } from "./socketModel";
import { useUserModel } from "./userModel";

// 全部模块初始化
export const initModel = () => {
  const sm = useSocketModel();
  const au = useAudioModel();
  const usr = useUserModel();
  const sys = useGlobalModel();
  const core = useCoreModel();
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
  // 对话框状态
  const [dialog, setDialog] = useState(initDialog);
  const [now, setNow] = useState<any>(); // 当前播放信息
  const [messages, setMessages] = useState([]); // 消息列表


  // 隐藏所有对话框
  const hdieAll = () => {
    setDialog({ ...initDialog });
  }
  // 显示其一对话框
  const showDialog = (key: string) => {
    setDialog((dig: any) => {
      if (dig[key]) {
        dig = { ...initDialog };
        console.log(dig);
      } else {
        dig = { ...initDialog };
        dig[key] = true;
      }
      return dig;
    });
  }

  // socket消息控制器
  function messageController(data: any) {
    const type = data['type'];
    data = data['data'];
    switch (type) {
      case MT.PLAY_SONG:
      case MT.NOW:
        const song = data['song'];
        const user = data['user'];
        const url = CST.server_host + "/song/playUrl/" + song['mid'];
        player.src = url;
        setNow({ ...song, uid: user['user_id'], uname: user['user_name'], url, since: data['since'] });
        fetchLrc(song.mid);
        break;
      case MT.ONLINE:
        setNow((n: any) => ({ ...n, onlineCount: data?.length || 0 }))
        break;
      case MT.PRE_LOAD_URL: break;
      case MT.SYSTEM: break;
      case MT.TEXT: break;
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
  function getNowTime(since: any = now['since']) {
    return (Date.now() / 1000) - since;
  }

  // 获取用户信息后连接socket
  function reconnect() {
    useUserModel.data?.fetchUserInfo().then((user: any) => { // 用户信息
      useSocketModel.data?.fetchWebsocketUrl().then((param) => { // 连接参数
        useSocketModel.data?.setMsgCtrl(param, messageController); // 连接socket
      })
    })
  }
  // 切换房间进入
  function changeRoom() {
    const sd = useSocketModel.data;
    message.success("房间切换中");
    sd?.setRoomAuth(a => ({
      id: a.id == 888 ? 890 : 888,
      pwd: ""
    }));
    sd?.fetchWebsocketUrl().then(data => sd?.setMsgCtrl(data, messageController));
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
  return { now, reconnect, messageController, changeRoom, tryPlay, getNowTime, dialog, hdieAll, showDialog };
}

export const useCoreModel = createModel(coreModule);