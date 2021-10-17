import { message } from "antd";
import { uploadImg } from "api/attach";
import dayjs from "dayjs";
export function classNames(clz: string, ...clazz: string[]) {
  return clz + " " + clazz.join(" ");
}
export const themeChange = (flag?: any) => {
  if (document.body.parentElement?.classList.contains("dark")) {
    document.body.parentElement?.classList.remove("dark");
  } else {
    document.body.parentElement?.classList.add("dark");
  }
};
export const setDark = () => {
  if (!document.body.parentElement?.classList.contains("dark")) {
    document.body.parentElement?.classList.add("dark");
  }
};

export // 获取操作系统信息
function getOsInfo() {
  var userAgent = navigator.userAgent.toLowerCase();
  var name = "Unknown";
  var version = "Unknown";
  if (userAgent.indexOf("win") > -1) {
    name = "Windows";
    if (userAgent.indexOf("windows nt 5.0") > -1) {
      version = "Windows 2000";
    } else if (
      userAgent.indexOf("windows nt 5.1") > -1 ||
      userAgent.indexOf("windows nt 5.2") > -1
    ) {
      version = "Windows XP";
    } else if (userAgent.indexOf("windows nt 6.0") > -1) {
      version = "Windows Vista";
    } else if (
      userAgent.indexOf("windows nt 6.1") > -1 ||
      userAgent.indexOf("windows 7") > -1
    ) {
      version = "Windows 7";
    } else if (
      userAgent.indexOf("windows nt 6.2") > -1 ||
      userAgent.indexOf("windows 8") > -1
    ) {
      version = "Windows 8";
    } else if (userAgent.indexOf("windows nt 6.3") > -1) {
      version = "Windows 8.1";
    } else if (
      userAgent.indexOf("windows nt 6.2") > -1 ||
      userAgent.indexOf("windows nt 10.0") > -1
    ) {
      version = "Windows 10";
    } else {
      version = "Unknown";
    }
  } else if (userAgent.indexOf("iphone") > -1) {
    name = "iPhone";
  } else if (userAgent.indexOf("mac") > -1) {
    name = "Mac";
  } else if (
    userAgent.indexOf("x11") > -1 ||
    userAgent.indexOf("unix") > -1 ||
    userAgent.indexOf("sunname") > -1 ||
    userAgent.indexOf("bsd") > -1
  ) {
    name = "Unix";
  } else if (userAgent.indexOf("linux") > -1) {
    if (userAgent.indexOf("android") > -1) {
      name = "Android";
    } else {
      name = "Linux";
    }
  } else {
    name = "Unknown";
  }
  return { name, version };
}

export const throttle = (fn: Function, rateTime: number) => {
  let prev = Date.now() - rateTime;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - prev >= rateTime) {
      fn.apply(this, args);
      prev = now;
    }
  };
};
export const debounce = (
  fn: Function,
  rateTime: number,
  immute: boolean = true
) => {
  let timer: any = null;
  let iImmute = immute;
  return (...args: any[]) => {
    if (iImmute) {
      fn.apply(this, args);
      iImmute = false;
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, rateTime);
  };
};

export const timeago = (time: Date | string | number) => {
  const date = new Date(time); // 给定时间
  const weekDay = date.getDay();
  const hours = date.getHours();

  const now = dayjs();
  const nowDayZore = now.subtract(now.hour(), "hours");
  const preDayZore = nowDayZore.subtract(1, "d");
  const weekZore = nowDayZore.subtract(now.day() - 1, "d");

  const zTime = date.getTime();
  if (
    zTime > nowDayZore.valueOf() &&
    zTime <= nowDayZore.add(1, "d").valueOf()
  ) {
    return dayjs(zTime).format(`${hours < 12 ? "上午" : "下午"}HH:mm`);
  }
  if (zTime > preDayZore.valueOf() && zTime < nowDayZore.valueOf()) {
    return dayjs(zTime).format(`昨天 ${hours < 12 ? "上午" : "下午"}HH:mm`);
  }
  if (zTime > weekZore.valueOf() && zTime < weekZore.add(1, "w").valueOf()) {
    return dayjs(zTime).format(
      `星期${weekDay} ${hours < 12 ? "上午" : "下午"}HH:mm`
    );
  }
  return dayjs(zTime).format(
    `YYYY年MM月DD ${hours < 12 ? "上午" : "下午"}HH:mm`
  );
};

export const uuid = function () {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/*光标处插入html代码，参数是String类型的html代码，例子："<p>猪头诺</p>"*/
export const insertHtml = (html: any) => {
  let sel: any, range: any;
  if (window.getSelection) {
    // IE9 或 非IE浏览器
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      var el = document.createElement("div");
      el.innerHTML = html;
      var frag = document.createDocumentFragment(),
        node,
        lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }
};

// localStorage操作
export const local = {
  get(key: string, def: any, str: boolean = false) {
    let v = localStorage.getItem(key);
    // console.log(`Local:GET:${key}--${v}`);
    try {
      if (!!v) return JSON.parse(v);
    } catch (error) {
      return def;
    }
    return def;
  },
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  },
};

// 房间历史操作
const maxHis = 15;
export const ROOM_HIS_KEY = "room_his";
export const roomHisCache = {
  push(payload: { room_id: number; room_name: string }) {
    const record = local.get(ROOM_HIS_KEY, []);
    const index = record?.findIndex(
      (item: any) => item.room_id == payload.room_id
    );
    if (~index) {
      record?.splice(index, 1);
    }
    record?.unshift(payload);

    if (record?.length > maxHis) {
      record?.pop();
    }
    local.set(ROOM_HIS_KEY, record);
  },
};

// 处理 Upload 自定义上传图片
export const handleUpload = (e: any, type: any, callback: Function) => {
  if (["image/jpeg", "image/png", "image/gif"].includes(e?.file?.type)) {
    const hide = message.loading({ content: "上传中..." });
    uploadImg({ file: e.file, type }).then((res: any) => {
      hide();
      callback(res);
    });
  }
};

export const copy = (sometext: string) => {
  let hiddenInput = document.createElement("input");
  hiddenInput.value = sometext;
  hiddenInput.setAttribute("readonly", "");
  hiddenInput.style.position = "absolute";
  hiddenInput.style.left = "-9999px";
  document.body.appendChild(hiddenInput);
  hiddenInput.select();
  hiddenInput.setSelectionRange(0, hiddenInput.value.length); // ios
  document.execCommand("copy");
  document.body.removeChild(hiddenInput);
};

export const hoc = (fn: Function, callback: () => Promise<any>) => {
  return () => {
    callback().then(() => {
      fn();
    });
  };
};
