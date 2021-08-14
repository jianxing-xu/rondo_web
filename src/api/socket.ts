import CST from "utils/CST";

// websocket 状态接口
interface IwsStatus {
  msg: string;
  status: number;
}

export interface IConnectParam {
  channel: number;
  account: number;
  ticket: any;
}
class Socket {
  public url: string; //websocket 链接地址
  private connected: boolean; //防止多次重连
  public timeOut?: number; // ♥跳间隔时长
  public ws: WebSocket | undefined; // websocket实例

  public channel: number | undefined;
  public account: number | undefined = -1;
  public ticket: string | undefined;

  constructor(timeOut: number = 3000) {
    // console.log("Socket INIT");
    const protocol = window.location.protocol == "http:" ? "ws://" : "wss://";
    this.url = protocol + CST.wsUrl;
    this.connected = false;
    this.timeOut = timeOut;
  }

  public changeRoom(roomId: number) {
    this.channel = roomId;
  }

  public setChannelParam(param: IConnectParam) {
    if (!param.channel || !param.account || !param.ticket) {
      throw new Error("缺少连接参数");
    }
    this.channel = param.channel;
    this.account = param.account;
    this.ticket = param.ticket;
  }

  // websocket 初始化
  public connect(
    messageController: (data: any) => void = (d: any) => {}
  ): void {
    if (this.connected) {
      console.log("Socket connected!");
      return;
    }
    this.ws = new WebSocket(
      this.url +
        `channel=${this.channel}&account=${this.account}&ticket=${this.ticket}`
    );
    this.ws.onopen = () => {
      console.log("Socket connect success!");
      this.connected = true;
    };

    this.ws.addEventListener("message", (e: any) => {
      messageController && messageController(JSON.parse(e.data));
    });

    this.ws.onerror = (e: any) => {
      this.reconnect();
    };

    this.ws.onclose = (e: any) => {
      this.connected = false;
    };
  }

  public forceClose() {
    const that = this;
    if (!this.connected) {
      console.log("Socket closed!");
      return Promise.resolve(true);
    }
    if (this.ws?.readyState == 1) {
      this.ws.send("bye");
      this.ws.close();
    }
    return new Promise((resolve) => {
      setTimeout(async () => {
        const v = await this.forceClose();
        resolve(v);
      }, 10);
    });
  }

  // 重连
  public reconnect(): void {
    if (this.connected) {
      return;
    }
    setTimeout(() => {
      this.reconnect();
    }, 5000);
  }

  // 返回websocket 实例 {promise}
  public getInstance(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      if (this.ws) {
        resolve(this.ws);
      } else {
        reject("出错啦！！！");
      }
    });
  }

  // 返回websocket的状态
  public wsStatus(): IwsStatus {
    // CONNECTING：值为0，表示正在连接。
    // OPEN：值为1，表示连接成功，可以通信了。
    // CLOSING：值为2，表示连接正在关闭。
    // CLOSED：值为3，表示连接已经关闭，或者打开连接失败。
    let status = this.ws?.readyState;
    let reStatus = {
      msg: "",
      status: 3,
    };
    switch (status) {
      case 0:
        reStatus = {
          msg: "connecting",
          status: 0,
        };
        break;
      case 1:
        reStatus = {
          msg: "open",
          status: 1,
        };
        break;
      case 2:
        reStatus = {
          msg: "closing",
          status: 2,
        };
        break;
      case 3:
        reStatus = {
          msg: "closed",
          status: 3,
        };
        break;
      default:
        return reStatus;
    }

    return reStatus;
  }

  // 设置消息控制和连接参数，连接.....
  public async setMsgCtrl(param: IConnectParam, ctrl?: (data: any) => void) {
    console.log("Start connect socket.....");
    this.setChannelParam(param);
    if (await this.forceClose()) {
      this.connect(ctrl);
    }
  }
}

export default Socket;
