import { getWebsocketUrl } from "api/room";
import Socket from "api/socket";
import { createModel } from "hox";
import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import CST, { MT } from "utils/CST";
import { player, useAudioModel } from "./audioModel";

export const socket = new Socket();
const socketModel = () => {
  const [info, setInfo] = useState<any>();
  const [roomId, setRoomId] = useState(888); // 房间号
  const [messages, setMessages] = useState([]); // 消息列表
  const { setCurrent } = useAudioModel();


  useEffect(() => {
    fetchUrl();
  }, []);

  function playerInit() {
    player.pause();
    player.currentTime = 0;
  }

  // socket消息控制器
  function messageController(data: any) {
    const type = data['type'];
    data = data['data'];
    switch (type) {
      case MT.PLAY_SONG:
      case MT.NOW:
        playerInit();
        const song = data['song'];
        const user = data['user'];
        player.src = CST.server_host + "/song/playUrl/" + song['mid'];
        const time = Date.now() / 1000 - data['since'];
        setCurrent(time);
        setInfo({ ...song, user });
        break;

      case MT.ONLINE: break;
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
    roomId, setRoomId, fetchUrl, changeRoom, info
  }
}


export const useSocketModel = createModel(socketModel);



