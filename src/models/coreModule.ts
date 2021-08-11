import { message, notification } from "antd";
import { IAtUser, messageList } from "api/message";
import { songLrc } from "api/song";
import { useFetch } from 'hooks/useFetch';
import { createModel } from "hox";
import { useEffect, useMemo, useState } from "react";
import { uuid } from "utils";
import CST, { MT, POPKEY } from "utils/CST";
import { noticePlayer, player, preloadPlayer, useAudioModel } from "./audioModel";
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

  return { au, usr, sm, sys };
}

let tryCount = 0;
let tryLrcCount = 0;
const initDialog = {
  SEARCH: false,// "Search", // 搜索
  MY_SONGS: false,// "MySongs", // 我的歌单列表
  ONLINE_LIST: false,// "OnlineList", // 在线用户列表
  WAIT_QUEUE: false,// "WaitQueue", // 等待播放
  PROFILE: false,// "Profile", // 用户信息
  PROFILE_ME: false, // 我的信息
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
  const { loading, data: msgs = [], setData: setMsgs, fetching: fetchingMsgs } = useFetch(messageList, parseInt(localStorage.getItem("pre_room_id") ?? "888"), { init: false });

  // 准备进入房间的id
  const [pre, setPre] = useState<any>();

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

  const checkMax = () => {
    if (msgs?.length && msgs.length > CST.historyMax) {
      setMsgs((msgs: [any]) => {
        msgs?.shift();
        return msgs;
      });
    }
  }

  // socket消息控制器
  function messageController(chatMsg: any) {
    const type = chatMsg['type'];
    const data = chatMsg['data'];
    switch (type) {
      case MT.PLAY_SONG:
        const song = data['song'];
        const user = data['user'];
        console.log(song, user, useUserModel.data?.user);
        if (user?.user_id == useUserModel.data?.user?.user_id) {
          if (useGlobalModel.data?.notice) {
            notification.info({ message: "正在播放你点的歌", description: `正在播放你点的歌：${song?.name}` });
          }
          if (useGlobalModel.data?.sound) {
            noticePlayer.play();
          }
        }
      case MT.NOW:
        const nsong = data['song'];
        const nuser = data['user'];
        const url = CST.static_url + "/song/playUrl/" + nsong['mid'];
        player.src = url;
        setNow({ ...nsong, uid: nuser?.user_id, uname: nuser?.user_name, url, since: data?.since });
        fetchLrc(nsong.mid);
        break;
      case MT.ONLINE:
        setNow((n: any) => ({ ...n, onlineCount: data?.length || 0 }))
        break;
      case MT.ADD_SONG:
        const addSong = data['song'];
        const addUser = data['user'];
        if (data['at'] && data['at'].user_id == useUserModel.data?.user?.user_id) {
          if (useGlobalModel.data?.sound) {
            noticePlayer.play();
          }
          if (useGlobalModel.data?.notice) {
            notification.info({ message: "有人给你送了一首歌", description: addUser?.user_name + " 送了一首 " + addSong?.name + " 给你！" })
          }
        }
        setMsgs((msgs: any[]) => ([...msgs, chatMsg]));
        break;
      // 摸一摸 和 系统消息一起
      case MT.SYSTEM:
      case MT.PUSH:
      case MT.JOIN:
      case MT.TOUCH:
      case MT.PASS:
      case MT.SHUT_DOWN:
      case MT.REMOVE_BAN:
      case MT.REMOVE_SONG:
        // 系统通知 @all
        if (!!data['@all']) {
          console.log(data['user'], useUserModel.data?.user);
          if (useGlobalModel.data?.notice && data['user']?.user_id != useUserModel.data?.user?.user_id) {
            notification.info({ message: "@全体成员", description: data['content'] });
          }
          if (useGlobalModel.data?.sound && data['user']?.user_id != useUserModel.data?.user?.user_id) {
            noticePlayer.play();
          }
          document.title = `@全体成员${data['user']?.user_name}：${data['content'].replace("@all", "")}`;
          setTimeout(() => {
            document.title = useSocketModel?.data?.room['room']?.room_name;
          }, 3000)
        }
        setMsgs((msgs: any[]) => ([...msgs, chatMsg]));
        break;
      case MT.PRE_LOAD_URL:
        preloadPlayer.src = CST.server_host + data['url'];
        preloadPlayer.load();
        break;
      case MT.IMG:
        console.log(msgs);
        setMsgs((msgs: any) => {
          return msgs.map((item: any) => {
            if (item.loading) {
              delete item.loading;
              item.message_id = data['message_id'];
            }
            return item;
          })
        });
        break;
      case MT.TEXT:
        if (data['at'] && data['at'].user_id == useUserModel.data?.user?.user_id) {
          if (useGlobalModel.data?.sound) {
            noticePlayer.play();
          }
          if (useGlobalModel.data?.notice) {
            notification.info({ message: "被@提醒", description: data['user']?.user_name + "@了你！" })
          }
        }
        setMsgs((msgs: any[]) => ([...msgs, data]));
        break;
      case MT.BACK:
        const msgId = data['message_id'];
        setMsgs((msgs: any) => {
          msgs = msgs.filter((item: any) => item.message_id != msgId);
          msgs.push(chatMsg);
          return msgs;
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

  // 重新载入预加载
  function reloadPreload() {

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

  // 获取用户信息后连接socket
  function reconnect() {
    const roomId = parseInt(localStorage.getItem("pre_room_id") ?? "888");
    setGlobleLoading(true);
    useUserModel.data?.fetchUserInfo().then((user: any) => { // 用户信息
      useSocketModel.data?.fetchRoomInfo(roomId).then(() => { // 房间信息
        fetchingMsgs(roomId).then(() => {
          useSocketModel.data?.fetchWebsocketUrl(roomId).then((param) => { // 连接参数
            useSocketModel.data?.setMsgCtrl(param, messageController); // 连接socket
          });
          pushAnno();
        }).catch((e) => { })
      }).catch(e => {
        // 进入加密房间提示输入密码，并先进入大厅
        if (e === 1039) {
          setPre(roomId);
          showDialog(POPKEY.ROOM_PWD);
          changeRoom(888);
        }
        // 游客第一次加载加密自动跳转到大厅
        if (e === 1008) {
          changeRoom(888)
        }
        if (e == 403) {
          reconnect();
        }
      }).finally(() => setGlobleLoading(false));
    }).catch(e => {
      if (e == 403) {
        reconnect();
      }
    }).finally(() => { }); // 此处不能改变状态
  }
  // 切换房间后重连socket
  function changeRoom(roomId: number, password = "") {
    const sd = useSocketModel.data;
    setGlobleLoading(true);
    return new Promise((resolve, reject) => {
      sd?.fetchRoomInfo(roomId, password).then(roomInfo => {
        fetchingMsgs(roomId).then(() => {
          pushAnno();
        });
        sd?.fetchWebsocketUrl(roomId).then(data => {
          sd?.setMsgCtrl(data, messageController);
          localStorage.setItem("pre_room_id", roomId.toString());
          resolve("success")
        });
      }).catch(e => {
        if (e === 1039 || e === 1139) {
          setPre(roomId);
          showDialog(POPKEY.ROOM_PWD);
          if (e === 1139) {
            message.error("房间密码密码错误");
          }
        }
        if (e == 403) {
          reconnect();
        }
        reject(e);
      }).finally(() => setGlobleLoading(false));
    })
  }

  // 添加公告
  const pushAnno = () => {
    const room = useSocketModel.data?.room;
    const announcement = {
      message_content: room?.room?.room_notice ?? "",// "dssfd"
      message_createtime: Date.now() / 1000,// 1628415100
      message_id: uuid(),// 154
      message_resource: room?.room?.room_notice ?? "",// "dssfd"
      message_status: 0,// 0
      message_to: room?.room?.room_id,// 888
      message_type: "text",// "text"
      message_user: room?.admin?.user_id,// 100006
      message_where: "channel",
      user: room?.admin
    }
    setMsgs((msgs: [any]) => ([...msgs, announcement]));
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

  useEffect(() => {
    checkMax();
  }, [msgs])

  // 初始化
  useEffect(() => {
    reconnect();
  }, [])
  return { pre, at, setAt, globalLoading, msgs, setMsgs, now, reconnect, messageController, changeRoom, tryPlay, getNowTime, dialog, hdieAll, showDialog };
}

export const useCoreModel = createModel(coreModule);