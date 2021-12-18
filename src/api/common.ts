/**
 * 公共api
 * @auther jason xu
 * @lastUpdate 2020/7/30
 */

import instance from "./request";

/** 发送邮件 */
export const sendMail = (mail: string) => {
  return instance.get(`/common/sendMail/${mail}`);
};

/** 发送bug */
export const sendBugs = (params: { content: string; contact: string }) => {
  return instance.get(`/common/sendBugs`, { params });
};

export const getConfig = (key: string): Promise<string> => {
  return instance.get(`/conf/conf/${key}`);
};
