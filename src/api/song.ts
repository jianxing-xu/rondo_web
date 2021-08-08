/**
 * 歌曲api
 * @auther jason xu
 * @lastUpdate 2020/7/30
 */


import { ILyric } from "models/audioModel";
import instance from "./request";

/** 搜索歌曲 */
export interface ISearchSongParam {
  isHot?: boolean;
  keyword?: string;
  page?: number;
}
export const searchSong = (data: ISearchSongParam): Promise<[any]> => {
  return instance.get("/song/search", { params: data });
}

/** 移除歌单中的歌曲(取消收藏) */
export const removeFav = (mid: number) => {
  return instance.delete(`/song/del/${mid}`);
}


/** 收藏歌曲 */
export const favSong = (mid: number, room_id: number) => {
  return instance.post("/song/fav", { mid, room_id });
}


/** 直接播放一首歌 */
export const playSong = (mid: number, room_id: number) => {
  return instance.post("/song/play", { mid, room_id });
}

/** 用户点歌 */
export interface IAddSongParam {
  mid: number;
  roomId: number;
  atUser?: number;
}
export const addSong = (data: IAddSongParam) => {
  return instance.post("/song/add", data);
}

/** 获取我的歌单 */
export interface IUserSongsParam {
  page_num: number;
  page_size?: number;
}
export const userSongs = (data: IUserSongsParam) => {
  return instance.get("/song/userSongs", { params: data });
}

/** 投票切歌 */
interface IPassSongParam {
  mid: number;
  room_id: number;
}
export const passSong = (data: IPassSongParam) => {
  return instance.get("/song/pass", { params: data });
}

/** 获取歌曲歌词 */
export const songLrc = (mid: number): Promise<ILyric[]> => {
  return instance.get(`/song/lrc/${mid}`);
}

/** 顶歌 */
export const pushSong = (mid: number, roomId: number) => {
  return instance.post("/song/push", { mid, roomId });
}

/** 从播放队列移除一首歌 */
export const removeForQueue = (mid: number, roomId: number) => {
  return instance.post("/song/removeForQueue", { mid, roomId });
}

/** 获取歌曲播放url */
export const playUrl = (mid: number) => {
  return instance.get(`/song/playUrl/${mid}`);
}

/** 获取房间队列歌曲 */
export const roomQueueSongs = (room_id: number) => {
  return instance.get(`/song/queue/${room_id}`);
}



















/** 添加一条点歌记录到数据库  */
interface IAddNewSong {
  song_mid: string;// 
  song_name: string;// 
  song_singer: string;// 
  song_pic: string;// 
  song_length: string;// 
}
export const addNewSong = (data: IAddNewSong) => {
  return instance.post("/song/addNewSong", data);
}