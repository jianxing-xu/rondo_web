/**
 * 附件api
 * @auther jason xu
 * @lastUpdate 2020/7/30
 */

import instance from "./request";


interface IAllAttachParam {
  pageNum: number;
  pageSize: number;
}
/** 获取所有附件 */
export const allAttach = (data: IAllAttachParam) => {
  return instance.post("/attach/all", data);
}


/** 上传图片 { file } */
interface IUploadImgParam {
  file: File;
  type: string; //0 头像   1: 聊天图片
}
export const uploadImg = (param: IUploadImgParam) => {
  const form = new FormData();
  form.append("file", param.file);
  form.append("type", param.type);
  return instance.post("/attach/uploadImg", form);
}
/** 上传歌曲 { file } */
export const uploadMusic = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return instance.post("/attach/uploadMusic", form);
}
