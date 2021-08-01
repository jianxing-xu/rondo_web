

/**
 * 房间api
 * @auther jason xu
 * @lastUpdate 2020/7/30
 */

import instance from "./request";


/** 获取热门房间 */
export const hotRooms = () => {
  return instance.get("/room/hot");
}


/** 创建房间 */
interface ICreateRoomParam {
  room_name: number; //"大厅",
  room_notice: number; //"欢迎来到rondo音乐大厅!",
  room_public: number;// //1, 0:公开  1:加密
  room_type: number;// 1, 4:电台
  room_votepass: number;// 1, // 1开启投票点歌
  room_votepercent: number;// 30,//投片比例
  room_addsong: number;// 0, //  1:仅房主点歌
  room_sendmsg: number;// 1, // 1：全员禁言  2：仅嘉宾发言  0：正常
  room_robot: number;// 1 //1:开启机器人
}
export const createRoom = (data: ICreateRoomParam) => {
  return instance.post("/room/create", data);
}

/** 获取房间信息 */
export const roomInfo = (roomId: number, room_password: string) => {
  return instance.get(`/room/info/${roomId}?room_password=${room_password}`)
}
/** 获取我的房间信息 */
export const myRoom = () => {
  return instance.get("/room/myRoom");
}

/** 更新房间 */
interface IUpdateRoomParam {
  room_name: string;// "AAAUG点歌音乐房",
  room_notice: string;// "AAA当前为夜间电台听歌模式，点歌请AAA当前为夜间电台听歌模式，点歌请明早9:00来呀",
  room_type: number;// 0,// 4:电台模式  0:点歌模式
  room_public: number;// 1, 
  room_password: number;// "123456",
  room_huya: string;// "https://www.huya.com/1234",
  room_votepass: number;// 1,
  room_addsong: number;// 1,
  room_sendmsg: number;// 0,
  room_robot: number;// 0,
  room_id: number;// 888
}
export const updateRoom = (data: IUpdateRoomParam) => {
  return instance.post("/room/update", data);
}

/** 获取房间WebSocketURL */
export const getWebsocketUrl = (roomId: number, password?: string): Promise<any> => {
  return instance.get(`/room/websocketUrl?channel=${roomId}&password=${password}`)
}

/** 删除房间 */
export const delRoom = (roomId: number) => {
  return instance.get(`/room/del/${roomId}`);
}