import { Divider, message, Modal, notification } from "antd";
import Socket, { IConnectParam } from "api/socket";
import { IAtUser, messageList } from "api/message";
import { getRoomInfo, getWebsocketUrl } from "api/room";
import { songLrc } from "api/song";
import { createModel } from "hox";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { local, roomHisCache, uuid } from "utils";
import CST, { MT, POPKEY, TOKEN_KEY } from "utils/CST";
import {
  noticePlayer,
  player,
  preloadPlayer,
  useAudioModel,
} from "./audioModel";
import { useGlobalModel } from "./globalModel";
import { myInfo } from "api/user";

// 初始化房间信息
export const defRoom = {
  room_background: "/res/images/nohead.jpg",
  room_createtime: 1598539777,
  room_fullpage: 0,
  room_hide: 0,
  room_id: 888,
  room_name: "AA点歌音乐房",
  room_notice:
    "AAA当前为夜间电台听歌模式，点歌请AAA当前为夜间电台听歌模式，点歌请明早9:00来呀",
  room_online: 2,
};
// 全部模块初始化 千万申明不能依赖任何数据
export const initModel = () => {
  useGlobalModel(() => []);
  useAudioModel(() => []);
  useCoreModel(() => []);
};

let tryCount = 0;
let tryLrcCount = 0;
const initDialog = {
  SEARCH: false, // "Search", // 搜索
  MY_SONGS: false, // "MySongs", // 我的歌单列表
  ONLINE_LIST: false, // "OnlineList", // 在线用户列表
  WAIT_QUEUE: false, // "WaitQueue", // 等待播放
  PROFILE: false, // "Profile", // 用户信息
  PROFILE_ME: false, // 我的信息
  ROOM_CREATE: false, // "RoomCreate", // 创建房间
  ROOM_LIST: false, // "RoomList", // 房间列表
  ROOM_PWD: false, // "RoomPwd", // 输入房间密码
  ROOM_SETTING: false, // "RoomSetting", // 房间设置
};
export const socket = new Socket();

// 用户模块移植

interface IUser {
  room?: any;
  admin?: boolean; // true,
  role?: number; // 1,
  user_account?: string; // "admin@rondo.com",
  user_app?: number; // 1,
  user_createtime?: number; // 0,
  user_device?: string; // "iPhone",
  user_extra?: string; // "",
  user_group?: number; // 1,
  user_head?: string; // "/res/new/images/nohead.jpg",
  user_icon?: number; // 1,
  user_id?: number; // 1,
  user_ipreg?: string; // "127.0.0.1",
  user_name?: string; // "机器人",
  user_openid?: string; // "",
  user_remark?: string; // "别@我,我只是个测试号",
  user_role?: number; // 1,
  user_salt?: string; // "zXZy",
  user_sex?: number; // 0,
  user_status?: number; // 0,
  user_touchtip?: string; // "别爱我，没结果，我只是机器人",
  user_updatetime?: string; // 1605004436,
  user_vip?: number; // 0,
  vip?: string; // false
}
interface IInitState {
  user: IUser;
  u: number | null;
}
const initState: IInitState = {
  user: CST.guestUserInfo,
  u: null,
};
export const UActionType = { SET: "SET_U", SU: "SU" };
const UReducer = (
  state: IInitState,
  { type, data }: { type: string; data?: any }
) => {
  switch (type) {
    case UActionType.SET:
      return { ...state, user: !!data ? data : CST.guestUserInfo };
    case UActionType.SU:
      return { ...state, u: !!data ? data : null };
    default:
      return state;
  }
};
function coreModule() {
  //当前房间信息
  const [room, setRoom] = useState<any>(defRoom);
  const roomId = useMemo(() => {
    return room ? room.room_id : 888;
  }, [room]);
  // 聊天被@的用户
  const [at, setAt] = useState<IAtUser | null>();
  // MainWindow loading状态
  const [globalLoading, setGlobleLoading] = useState(false);
  // 对话框状态
  const [dialog, setDialog] = useState<any>(initDialog);
  // 当前播放信息
  const [now, setNow] = useState<any>();
  // 消息列表
  const [msgs, setMsgs] = useState<any[]>([]);
  // 准备进入房间的id
  const [pre, setPre] = useState<any>();
  const [state, dispatch] = useReducer(UReducer, initState); // UserModel

  // 获取我的信息
  function fetchUserInfo() {
    return new Promise((resolve, reject) => {
      if (!!!local.get(TOKEN_KEY.ACCESS, "")) {
        dispatch({ type: UActionType.SET });
        resolve(CST.guestUserInfo);
      }
      myInfo()
        .then((data) => {
          dispatch({ type: UActionType.SET, data });
          resolve(data);
        })
        .catch(reject);
    });
  }

  // 重置用户信息
  function resetUser() {
    localStorage.removeItem(TOKEN_KEY.ACCESS);
    dispatch({ type: UActionType.SET });
  }

  // 登出
  function logout() {
    resetUser();
    hdieAll();
    reconnect();
  }

  // 获取消息列表
  const fetchingMsgs = (roomId: number, roomInfo: any) => {
    messageList(roomId).then((res: any) => {
      setTimeout(() => {
        res.push(pushAnno(roomInfo));
        setMsgs(res);
      }, 300);
    });
  };

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
    if (hide) {
      setDialog({ ...initDialog });
    }
  };
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
  };

  // 检查当前显示最大消息数量
  const checkMax = () => {
    if (msgs?.length && msgs.length > CST.historyMax) {
      setMsgs((msgs: any[]) => {
        msgs?.shift();
        return msgs;
      });
    }
  };

  // socket消息控制器
  function messageController(chatMsg: any) {
    const type = chatMsg["type"];
    const data = chatMsg["data"];
    switch (type) {
      case MT.PLAY_SONG:
        const song = data["song"];
        const user = data["user"];
        if (user?.user_id == useCoreModel.data?.user?.user_id) {
          if (useGlobalModel.data?.notice) {
            notification.info({
              message: "正在播放你点的歌",
              description: `正在播放你点的歌：${song?.name}`,
            });
          }
          if (useGlobalModel.data?.sound) {
            noticePlayer.play();
          }
        }
      case MT.NOW:
        const nsong = data["song"];
        const nuser = data["user"];
        const url = CST.static_url + "/song/playUrl/" + nsong["mid"];
        player.src = url;
        setNow({
          ...nsong,
          uid: nuser?.user_id,
          uname: nuser?.user_name,
          url,
          since: data?.since,
        });
        fetchLrc(nsong.mid);
        break;
      case MT.ONLINE:
        setNow((n: any) => ({ ...n, onlineCount: data?.length || 0 }));
        break;
      case MT.ADD_SONG:
        const addSong = data["song"];
        const addUser = data["user"];
        if (
          data["at"] &&
          data["at"].user_id == useCoreModel.data?.user?.user_id
        ) {
          if (useGlobalModel.data?.sound) {
            noticePlayer.play();
          }
          if (useGlobalModel.data?.notice) {
            notification.info({
              message: "有人给你送了一首歌",
              description:
                addUser?.user_name + " 送了一首 " + addSong?.name + " 给你！",
            });
          }
        }
        setMsgs((msgs: any[]) => [...msgs, chatMsg]);
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
        // case MT.FAV
        // 系统通知 @all
        if (!!data["@all"]) {
          if (
            useGlobalModel.data?.notice &&
            data["user"]?.user_id != useCoreModel.data?.user?.user_id
          ) {
            notification.info({
              message: "@全体成员",
              description: data["content"],
            });
          }
          if (
            useGlobalModel.data?.sound &&
            data["user"]?.user_id != useCoreModel.data?.user?.user_id
          ) {
            noticePlayer.play();
          }
          document.title = `@全体成员${data["user"]?.user_name}：${data[
            "content"
          ].replace("@all", "")}`;
          setTimeout(() => {
            document.title = room?.room_name;
          }, 3000);
        }
        setMsgs((msgs: any[]) => [...msgs, chatMsg]);
        break;
      case MT.PRE_LOAD_URL:
        preloadPlayer.src = CST.server_host + data["url"];
        preloadPlayer.load();
        break;
      case MT.IMG:
      case MT.TEXT:
        if (
          data["at"] &&
          data["at"].user_id == useCoreModel.data?.user?.user_id
        ) {
          if (useGlobalModel.data?.sound) {
            noticePlayer.play();
          }
          if (useGlobalModel.data?.notice) {
            notification.info({
              message: "被@提醒",
              description: data["user"]?.user_name + "@了你！",
            });
          }
        }
        setMsgs((msgs: any) => {
          msgs = msgs.map((item: any) => {
            if (item.loading) {
              delete item.loading;
              item.message_id = data["message_id"];
            }
            return item;
          });
          if (useCoreModel.data?.user?.user_id !== data?.message_user) {
            msgs.push(data);
          }
          return msgs;
        });
        break;
      case MT.BACK:
        const msgId = data["message_id"];
        setMsgs((msgs: any) => {
          msgs = msgs.filter((item: any) => item.message_id != msgId);
          msgs.push(chatMsg);
          return msgs;
        });
        break;
      case MT.CLEAR:
        setMsgs([]);
        break;
      case MT.PRE_LOAD_URL:
        break; // !!!!LKDfjskfjs///
      case MT.ROOM_UPDATE:
        setMsgs((msgs: any[]) => [...msgs, chatMsg]);
        const reConnect = data?.reConnect;
        if (reConnect) {
          // 需要重载
          setTimeout(() => {
            location.reload();
          }, 2000);
        }
        break; // coming soon
      default:
        break;
    }
  }

  // 重新载入预加载
  function reloadPreload() {}

  // 重新加载url
  function tryPlay() {
    if (!player.paused) {
      console.log("加载歌曲成功");
      tryCount = 0;
      return;
    }
    if (tryCount > 5) {
      console.log("重试了5次还是加载失败");
      return;
    }
    tryCount++;
    console.log(`正在第${tryCount}重试(重新载入url)....`);
    player.src = now["url"] + "?time=" + Date.now();
    player.load();
    setTimeout(() => {
      tryPlay();
    }, 5000);
  }

  // 获取当前播放进度
  function getNowTime(since: any = now?.since ?? Date.now() / 1000) {
    return Date.now() / 1000 - since;
  }

  // 切换房间后重连socket
  function changeRoom(roomId: number, password = "") {
    setGlobleLoading(true);
    return new Promise((resolve, reject) => {
      fetchRoomInfo(roomId, password)
        .then((info: any) => {
          fetchingMsgs(roomId, info);
          fetchWebsocketUrl(roomId, messageController).then((data) => {
            local.set("pre_room_id", roomId);
            roomHisCache.push({
              room_id: roomId,
              room_name: info?.room?.room_name ?? "",
            });
            resolve(info);
          });
        })
        .catch((e) => {
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
        })
        .finally(() => setGlobleLoading(false));
    });
  }

  // 添加公告
  const pushAnno = (roomInfo: any) => {
    const announcement = {
      message_content: roomInfo?.room_notice ?? "", // "dssfd"
      message_createtime: Date.now() / 1000, // 1628415100
      message_id: uuid(), // 154
      message_resource: roomInfo?.room_notice ?? "", // "dssfd"
      message_status: 0, // 0
      message_to: roomInfo?.room_id, // 888
      message_type: "text", // "text"
      message_user: roomInfo?.admin?.user_id, // 100006
      message_where: "channel",
      user: roomInfo?.admin,
    };
    return announcement;
  };

  // 获取歌词 and try
  async function fetchLrc(mid: number) {
    useAudioModel.data?.setLrc([]);
    try {
      const data = await songLrc(mid);
      useAudioModel.data?.setLrc(data);
    } catch (error) {
      if (tryLrcCount > 5) {
        useAudioModel.data?.setLrc([
          { lineLyric: "歌词加载失败", time: "0.0" },
        ]);
        return;
      }
      tryLrcCount++;
      console.log(`歌词失败第${tryLrcCount}次重试`);
      setTimeout(() => {
        fetchLrc(mid);
      }, 2000);
    }
  }

  // 获取房间信息
  function fetchRoomInfo(roomId: number, password: string = "") {
    return new Promise((resolve, reject) => {
      getRoomInfo(roomId, password)
        .then((data) => {
          setRoom(data);
          resolve(data);
        })
        .catch(reject);
    });
  }

  // 获取websocket连接url的链接参数
  async function fetchWebsocketUrl(
    roomId: number,
    messageController: any
  ): Promise<IConnectParam> {
    try {
      const data = await getWebsocketUrl(roomId);
      socket.setMsgCtrl(data, messageController); // 连接socket
      return data;
    } catch (error) {
      return error;
    }
  }

  useEffect(() => {
    document.title = room?.room_name ?? "音乐大厅";
  }, [room]);

  useEffect(() => {
    checkMax();
  }, [msgs]);
  // 初始化
  useEffect(() => {
    Modal.info({
      content: React.createElement(
        "div",
        { style: { color: "var(--font-normal)" } },
        "欢迎光临！"
      ),
      okCancel: false,
      okType: "dashed",
      onOk() {
        player.pause();
        if (!player.oncanplay) {
          player.oncanplay = () => {
            player.play();
          };
        }
        reconnect();
      },
    });
  }, []);
  // 获取用户信息后连接socket
  function reconnect() {
    try {
      setGlobleLoading(true);
      const roomId = local.get("pre_room_id", 888);
      fetchUserInfo()
        .then(() => {
          // 用户信息
          // 房间信息
          fetchRoomInfo(roomId)
            .then((roomInfo) => {
              //获取消息
              fetchingMsgs(roomId, roomInfo);
              // 连接socket
              fetchWebsocketUrl(roomId, messageController);
            })
            .catch((e) => {
              // 进入加密房间提示输入密码，并先进入大厅
              if (e === 1039) {
                setPre(roomId);
                showDialog(POPKEY.ROOM_PWD);
                changeRoom(888);
              }
              // 游客第一次加载加密自动跳转到大厅
              if (e === 1008) {
                changeRoom(888);
              }
              if (e == 403) {
                reconnect();
              }
            })
            .finally();
        })
        .catch((e: any) => {
          console.log(e);
          if (e == 403) {
            reconnect();
          }
          if (e == 1004) {
            reconnect();
          }
        })
        .finally(() => setGlobleLoading(false)); // 此处不能改变状态
    } catch (error) {
      console.log(error);
    }
  }
  return {
    pre,
    at,
    globalLoading,
    msgs,
    now,
    dialog,
    room,
    roomId,
    setMsgs,
    setAt,
    reconnect,
    messageController,
    changeRoom,
    tryPlay,
    getNowTime,
    hdieAll,
    showDialog,
    fetchRoomInfo,
    fetchUserInfo,
    resetUser,
    logout,
    ...state,
    udsp: dispatch,
  };
}

export const useCoreModel = createModel(coreModule);
