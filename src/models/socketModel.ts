import { getWebsocketUrl } from "api/room";
import Socket from "api/socket";
import { createModel } from "hox";
import { useState } from "react";
import { Alert, message } from "antd";
import { MT } from "utils/CST";

export const socket = new Socket();
const socketModel = () => {
  const [roomId, setRoomId] = useState(888); // 房间号
  const [messages, setMessages] = useState([]); // 消息列表

  // socket消息控制器
  function messageController(data: any) {
    console.warn("RECEIVE_TIME: " + new Date(data["timestamp"]));
    switch (data["type"]) {
      case MT.NOW: break;
      case MT.ONLINE: break;
      case MT.PLAY_SONG: break;
      case MT.PRE_LOAD_URL: break;
      case MT.SYSTEM: break;
      case MT.TEXT: break;
      default: break;
    }
  }

  // 获取websocket连接url，获取到后关闭之前的链接，立刻开始现在的链接
  async function fetchUrl() {
    return getWebsocketUrl(roomId).then(async res => {
      if (await socket.forceClose()) {
        console.log("FETCH_URL>>>");
        socket.setChannelParam({ ...res });
        socket.connect(messageController);
      }
    })
  }
  // 切换房间进入
  function changeRoom() {
    message.success("房间切换中");
    setRoomId(v => v == 888 ? 890 : 888)
    fetchUrl().then(res => {
      message.success("房间切换成功...");
    });
  }
  return {
    roomId, setRoomId, fetchUrl, changeRoom
  }
}


export const useSocketModel = createModel(socketModel);



