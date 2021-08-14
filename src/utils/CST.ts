export default {
  visitorToken:
    "1d40dc0b40000743d69ba671d8a418250f66422df9c61e332deeec7c15a2dade",
  guestUserInfo: {
    room: null,
    user_head: "/res/images/nohead.jpg",
    user_id: -1,
    user_name: "Ghost",
  },
  // static_url: "http://localhost:8080/api",
  // server_host: "http://localhost:8080/",
  // wsUrl: "localhost:8081/ws?",
  static_url: "http://49.235.175.45:8899/api",
  server_host: "http://49.235.175.45:8899/",
  wsUrl: "49.235.175.45:8810/ws?",
  historyMax: 50, // 显示最大消息条数
};
export const MT = {
  ADD_SONG: "addSong", // , "点歌{user,song}"),
  PLAY_SONG: "playSong", //,,播放歌曲{user,song}"),
  SYSTEM: "system", //,"系统消息"),
  TEXT: "text", //"文字消息"),
  IMG: "img", //,"图片消息"),
  LINK: "link", // "链接消息"),
  ONLINE: "online", //,"在线用户列表"),
  REMOVE_SONG: "remove_song", //"移除歌曲{user,song}"),
  REMOVE_BAN: "remove_ban", //,"解禁用户"),
  SHUT_DOWN: "shutdown", //,"禁言用户{user}"),
  SONG_DOWN: "songdown", //,"禁止点歌{user}"),
  PASS: "pass", //,"切歌{user}"),
  BACK: "back", //,"消息撤回"),
  ROOM_UPDATE: "room_update", //,"房间资料更新{room}"),
  PRE_LOAD_URL: "preload", //,"预加载url{url}");
  NOW: "now", // 正在播放的歌曲
  JOIN: "join", // 加入房间
  PUSH: "push", //顶歌
  CLEAR: "clear", // 清除消息
  TOUCH: "touch", //摸一摸
};
export const TOKEN_KEY = {
  TEMP: "temp-token",
  ACCESS: "access-token",
};

export const POPKEY = {
  SEARCH: "SEARCH", // 搜索
  MY_SONGS: "MY_SONGS", // 我的歌单列表
  ONLINE_LIST: "ONLINE_LIST", // 在线用户列表
  WAIT_QUEUE: "WAIT_QUEUE", // 等待播放
  PROFILE: "PROFILE", // 用户信息
  ROOM_CREATE: "ROOM_CREATE", // 创建房间
  ROOM_LIST: "ROOM_LIST", // 房间列表
  ROOM_PWD: "ROOM_PWD", // 输入房间密码
  ROOM_SETTING: "ROOM_SETTING", // 房间设置
  PROFILE_ME: "PROFILE_ME", // 我的信息
};
// MySetting: false,
// MySongList: false,
// OnlineList: false,
// PlayingSongList: false,
// Profile: false,
// RoomCreate: false,
// RoomList: false,
// RoomPassword: false,
// RoomSetting: false,
// SearchSongs: false,
// SystemSetting: false,
// Login: false,
