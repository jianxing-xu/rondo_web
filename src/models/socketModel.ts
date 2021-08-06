import { getRoomInfo, getWebsocketUrl } from "api/room";
import Socket, { IConnectParam } from "api/socket";
import { createModel } from "hox";
import { useEffect, useState } from "react";


export const socket = new Socket();
const socketModel = () => {
  const [roomAuth, setRoomAuth] = useState<{ id: number, pwd?: string }>({
    id: parseInt(localStorage.getItem("pre_room_id") ?? "888"),
  }); //当前 连接房间号
  const [room, setRoom] = useState<any>();//当前房间信息

  // 获取房间信息
  async function fetchRoomInfo(roomId: number, password: string = "") {
    return new Promise((resolve, reject) => {
      getRoomInfo(roomId, password).then(data => {
        setRoom(data);
        resolve(data);
      }).catch(e => {
        reject(e);
      })
    });
  }

  // 获取websocket连接url的链接参数
  async function fetchWebsocketUrl(roomId: number): Promise<IConnectParam> {
    try {
      const data = await getWebsocketUrl(roomId);
      return data;
    } catch (error) {
      return error;
    }
  }

  // 设置消息控制和连接参数，连接.....
  async function setMsgCtrl(param: IConnectParam, ctrl?: (data: any) => void) {
    console.log("Start connect socket.....");
    socket.setChannelParam(param);
    if (await socket.forceClose()) {
      socket.connect(ctrl);
    }
  }

  // useEffect(() => {
  //   fetchRoomInfo(roomAuth.id).catch(e => {
  //     console.log("提示密码输入等.....")
  //   })
  // }, [])

  return {
    roomAuth, setRoomAuth, fetchWebsocketUrl, setMsgCtrl, fetchRoomInfo, room
  }
}


export const useSocketModel = createModel(socketModel);



