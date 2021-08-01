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
  type: number; //0 头像   1: 聊天图片
}
export const uploadImg = (formData: FormData) => {
  return instance.post("/attach/uploadImg", formData);
}
/** 上传歌曲 { file } */
export const uploadMusic = (formData: FormData) => {
  return instance.post("/attach/uploadMusic", formData);
}
