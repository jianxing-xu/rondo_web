import { message, Spin } from "antd";
import { pushSong, removeForQueue, roomQueueSongs } from "api/song";
import { RightPanelWrapper } from "components/AddSongPanel";
import { useFetch } from "hooks/useFetch";
import { useCoreModel } from "models/coreModule";
import React, { useEffect } from "react";
import { classNames } from "utils";
import { POPKEY } from "utils/CST";

import _ from "./index.module.css";
import { HideAllIcon } from "components/HideAllIcon";

export const RightHead = () => {
  return (
    <div className="flex items-center justify-between py-3 text-2xl">
      <span>等待播放歌曲</span>
      <span
        onClick={() => useCoreModel?.data?.showDialog(POPKEY.SEARCH)}
        className="self-center px-1 text-sm border rounded cursor-pointer select-none"
        style={{ borderColor: "var(--font-normal)" }}
      >
        我要点歌
      </span>
      <HideAllIcon />
    </div>
  );
};

interface IWaitQueuePanel {}
export const WaitQueuePanel: React.FC<IWaitQueuePanel> = ({}) => {
  const { data, setData, loading, fetching, err } = useFetch(
    roomQueueSongs,
    useCoreModel.data?.roomId,
    { init: false }
  );

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
  // 顶歌
  const pushSongHandle = async (mid: number, idx: number) => {
    attachLoading(idx);
    pushSong(mid, useCoreModel.data?.roomId)
      .then((res) => {})
      .catch((e) => {
        attachLoading(idx, false);
        fetching();
      })
      .finally(() => {});
  };
  const remove = (mid: number, index: number) => {
    removeForQueue(mid, useCoreModel.data?.roomId).then(() => {
      fetching();
      message.success("删除成功");
    });
  };

  useEffect(() => {
    fetching();
    const timer = setInterval(() => {
      fetching();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <RightPanelWrapper>
      <RightHead />
      <div
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
            {!!err && !loading ? (
              <span className="py-4">数据获取失败</span>
            ) : !!!err && !loading && data?.length == 0 ? (
              <span className="py-4">世界的尽头</span>
            ) : null}
          </h2>
          {loading ? <div className="py-40"></div> : null}
          {!loading &&
            data?.map((item: any, index: number) => (
              // 单个
              <Spin spinning={item?.loading ?? false} key={index}>
                <div
                  key={index}
                  className="relative flex flex-1 px-2 py-2 m-2 transition rounded hover:bg-select"
                >
                  <img
                    className="w-12 h-12 rounded"
                    src={item?.song?.pic}
                    alt=""
                  />
                  <div className="w-2/3 pl-2">
                    <div className="truncate">{item?.song?.name || ""}</div>
                    <div className="pt-2 truncate text-xxs text-light">
                      点歌人:{item?.user?.user_name || ""} 歌手:{" "}
                      {item?.song?.singer || ""}
                    </div>
                  </div>
                  <div className="flex flex-col items-stretch relavite right-2 ">
                    <div
                      onClick={() => pushSongHandle(item?.song?.mid, index)}
                      className="absolute w-10 px-1 text-center transition border rounded cursor-pointer select-none right-2 text-xxs active:text-gray-900 dark:active:text-gray-100 active:bg-opacity-60"
                      style={{ borderColor: "var(--font-normal)" }}
                    >
                      顶
                    </div>
                    {useCoreModel.data?.user.admin ||
                    useCoreModel.data?.room?.room_user ===
                      useCoreModel?.data?.user?.user_id ? (
                      <div
                        onClick={() => remove(item?.song?.mid, index)}
                        className="absolute w-10 px-1 text-center transition border rounded cursor-pointer select-none right-2 bottom-2 text-xxs active:text-gray-900 dark:active:text-gray-100 active:bg-opacity-60"
                        style={{ borderColor: "var(--font-normal)" }}
                      >
                        {" "}
                        移除
                      </div>
                    ) : null}
                  </div>
                </div>
              </Spin>
            ))}
        </Spin>
      </div>
    </RightPanelWrapper>
  );
};
