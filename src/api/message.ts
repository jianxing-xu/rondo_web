/**
 * 消息api
 * @auther jason xu
 * @lastUpdate 2020/7/30
 */

import instance from "./request";

/** 发送消息 */
export interface IAtUser {
  // 参数字段
  user_id: number; // : 1,
  user_name: string; // : "机器人"
  // 前台处理at字段
  user_head?: string; // 头像
  type?: number; // 0:送歌@  1:聊天@
  user_account: string;
}
interface ISendParameter {
  room_id: string; // : 888,
  atUser?: IAtUser | null;
  type: string; // : "img",
  where?: string; // : "channel",
  msg?: string; // : "hello <script>alert('Xss来了')</script>",
  resource?: string; // : "/res/bg.png"
}
export const send = (data: ISendParameter) =>
  instance.post("/message/send", data);

/** 获取消息列表 */
export const messageList = (roomId: number) =>
  instance.get(`/message/list/${roomId}`);

/** 撤回消息 */
export const backMessage = (roomId: number, messageId: number) =>
  instance.delete(`/message/back/${roomId}/${messageId}`);

/** 摸一摸 */
interface IMoParameter {
  at: number;
  room_id: number;
}
export const mo = (data: IMoParameter) => instance.post("/message/mo", data);
