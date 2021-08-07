
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
}
export const setDark = () => {
  if (!document.body.parentElement?.classList.contains("dark")) {
    document.body.parentElement?.classList.add("dark");
  }
}

export // 获取操作系统信息 
  function getOsInfo() {
  var userAgent = navigator.userAgent.toLowerCase();
  var name = 'Unknown';
  var version = 'Unknown';
  if (userAgent.indexOf('win') > -1) {
    name = 'Windows';
    if (userAgent.indexOf('windows nt 5.0') > -1) {
      version = 'Windows 2000';
    } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
      version = 'Windows XP';
    } else if (userAgent.indexOf('windows nt 6.0') > -1) {
      version = 'Windows Vista';
    } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
      version = 'Windows 7';
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
      version = 'Windows 8';
    } else if (userAgent.indexOf('windows nt 6.3') > -1) {
      version = 'Windows 8.1';
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
      version = 'Windows 10';
    } else {
      version = 'Unknown';
    }
  } else if (userAgent.indexOf('iphone') > -1) {
    name = 'iPhone';
  } else if (userAgent.indexOf('mac') > -1) {
    name = 'Mac';
  } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
    name = 'Unix';
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android';
    } else {
      name = 'Linux';
    }
  } else {
    name = 'Unknown';
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
  }
}


export const timeago = (time: Date | string | number) => {
  const date = new Date(time); // 给定时间
  const yean = date.getFullYear();
  const month = date.getMonth();
  const weekDay = date.getDay();
  const day = date.getDate();
  const hours = date.getHours();
  const minus = date.getMinutes();
  const seconds = date.getSeconds();

  const now = dayjs();
  const nowDayZore = now.subtract(now.hour(), "hours");
  const preDayZore = nowDayZore.subtract(1, "d");
  const weekZore = nowDayZore.subtract(now.day() - 1, "d");

  const zTime = date.getTime();
  // console.log(nowDayZore.valueOf(), zTime, nowDayZore.valueOf() + 86400);
  if (zTime > nowDayZore.valueOf() && zTime <= nowDayZore.valueOf() + 86400) {
    return `${hours < 12 ? "上午" : "下午"} ${hours}:${minus}`;
  }
  if (zTime > preDayZore.valueOf() && zTime < nowDayZore.valueOf()) {
    return `昨天 ${hours < 12 ? "上午" : "下午"} ${hours}:${minus}`
  }
  if (zTime > weekZore.valueOf() && zTime < (weekZore.valueOf() + 604800)) {
    return `星期${weekDay} ${hours < 12 ? "上午" : "下午"} ${hours}:${minus}`
  }
  return dayjs(zTime).format("YYYY年MM月DD") + ` ${hours < 12 ? "上午" : "下午"} ${hours}:${minus}`;
}
