import { message, Spin } from "antd";
import { addSong, IUserSongsParam, removeFav, userSongs } from "api/song";
import { HideAllIcon } from "components/HideAllIcon";
import { useFetch } from "hooks/useFetch";
import { useCoreModel } from "models/coreModule";
import React, { useState } from "react";
import { classNames, throttle } from "utils";

import _ from "./index.module.css";

export const RightHead = ({ title = "" }) => {
  return (
    <div className="flex items-center justify-between py-3 text-2xl">
      <span>{title}</span>
      <HideAllIcon />
    </div>
  );
};

export const RightPanelWrapper: React.FC = ({ children }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ width: 400 }}
      className="absolute top-0 bottom-0 right-0 h-full p-2 shadow-2xl MyPanel bg-main"
    >
      {children}
    </div>
  );
};
interface MySongsPanel {}
export const MySongsPanel: React.FC<MySongsPanel> = () => {
  const [pager, setPager] = useState<IUserSongsParam>({
    page_num: 1,
  });
  const { data, setData, setParam, loading, fetching, err } = useFetch(
    userSongs,
    pager,
    { init: true }
  );

  // 点歌处理
  const addSongHandle = (mid: any, index: number) => {
    attachLoading(index);
    addSong({ mid, roomId: useCoreModel?.data?.roomId })
      .then(() => {
        message.success("点歌成功");
        fetching();
      })
      .catch((e) => {})
      .finally(() => attachLoading(index, false));
  };
  // 删除
  const removeSong = (mid: number, index: number) => {
    attachLoading(index);
    removeFav(mid)
      .then(() => {
        message.success("删除成功");
        fetching();
      })
      .catch((e) => {})
      .finally(() => attachLoading(index, false));
  };
  // 给搜索条目附加loading状态
  const attachLoading = (index: number, flag: boolean = true) => {
    setData((data: any) => {
      for (let i = 0; i < data?.length || 0; i++) {
        if (i == index) {
          if (flag) {
            data[i]["loading"] = flag;
          } else {
            delete data[i]["loading"];
          }
          break;
        }
      }
      return data;
    });
  };

  const onScroll = (e: any) => {
    if (
      e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight &&
      !loading
    ) {
      setParam((p: any) => {
        if (p.page_num < data?.totalPage) {
          p.page_num++;
        }
        return p;
      });
    }
    if (e.target.scrollTop <= 10) {
      setParam((p: any) => {
        p.page_num = p.page_num <= 1 ? 1 : p.page_num - 1;
        return p;
      });
    }
  };

  return (
    <RightPanelWrapper>
      <RightHead title="我点过的歌" />
      <div
        onScroll={throttle(onScroll, 1000)}
        className="absolute bottom-0 left-0 right-0 overflow-y-auto m_scroll"
        style={{ top: 70 }}
      >
        <Spin spinning={loading}>
          <h2
            className={classNames(
              `text-2xl text-center text-current ${
                loading && data?.length == 0 ? "pt-20" : ""
              }`
            )}
          >
            {!!err ? (
              <span className="py-4">数据拉取失败</span>
            ) : !!!err && data?.list?.length == 0 ? (
              <span className="py-4">世界的尽头</span>
            ) : null}
          </h2>
          {loading && !data?.length ? <div className="py-40"></div> : null}
          {data?.list?.map((item: any, index: number) => (
            // 单个
            <Spin spinning={item?.loading ?? false} key={index}>
              <div
                key={index}
                className="relative flex flex-1 px-2 py-2 m-2 transition rounded hover:bg-select"
              >
                <img
                  className="w-12 h-12 rounded"
                  src={item?.song_pic}
                  alt=""
                />
                <div className="w-3/5 pl-2">
                  <div className="truncate">
                    <span className="text-primary">({item?.song_week})</span>
                    {item?.song_name}
                  </div>
                  <div className="pt-2 truncate text-xxs text-light">
                    {item?.song_singer}
                  </div>
                </div>
                <div
                  onClick={() => removeSong(item.song_mid, index)}
                  className="absolute w-10 px-1 text-center transition border rounded cursor-pointer select-none right-2 text-xxs active:text-gray-900 dark:active:text-gray-100 active:bg-opacity-60"
                  style={{ borderColor: "var(--font-normal)" }}
                >
                  删除
                </div>
                <div
                  onClick={() => addSongHandle(item.song_mid, index)}
                  className="absolute w-10 px-1 text-center transition border rounded cursor-pointer select-none right-14 text-xxs active:text-gray-900 dark:active:text-gray-100 active:bg-opacity-60"
                  style={{ borderColor: "var(--font-normal)" }}
                >
                  点歌
                </div>
              </div>
            </Spin>
          ))}
        </Spin>
      </div>
    </RightPanelWrapper>
  );
};
