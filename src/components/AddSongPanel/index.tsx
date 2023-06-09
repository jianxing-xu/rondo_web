import { message, Spin } from "antd";
import { addSong, ISearchSongParam, searchSong } from "api/song";
import { HideAllIcon } from "components/HideAllIcon";
import { MInput } from "components/MInput";
import { useFetch } from "hooks/useFetch";
import { useCoreModel } from "models/coreModule";
import React, { useState } from "react";
import { classNames } from "utils";
import CST from "utils/CST";

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
interface IAddSongPanel {}
export const AddSongPanel: React.FC<IAddSongPanel> = () => {
  const { at, setAt } = useCoreModel((m) => [m.at]);
  const [param, setParam] = useState<ISearchSongParam>({
    isHot: true,
    keyword: "",
    page: 1,
  });
  const { data, setData, loading, fetching, err } = useFetch(searchSong, param);

  // 搜索处理
  const onSearch = async (v: any) => {
    setParam((p) => ({ ...p, isHot: false }));
    fetching({ keyword: v, page: 1, isHot: false }).catch((e) => {
      message.error("搜索失败");
    });
  };
  // 点歌处理
  const addSongHandle = (mid: any, index: number) => {
    attachLoading(index);
    addSong({ roomId: useCoreModel.data?.roomId, mid, atUser: at?.user_id })
      .then(() => {
        message.success("点歌成功！");
      })
      .catch((e) => {
        console.log(e);
      })
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

  return (
    <RightPanelWrapper>
      {at && at.type == 0 ? (
        <div
          className="absolute bottom-0 z-10 flex flex-1 px-2 py-2 m-2 rounded shadow-md left-3 right-3"
          style={{ background: "var(--bg-float)" }}
        >
          <img
            className="w-12 h-12 rounded"
            src={CST.static_url + at?.user_head}
            alt=""
          />
          <div className="w-2/3 pl-2">
            <div className="truncate text-normal">{at?.user_name}</div>
            <div className="pt-2 truncate text-xxs text-normal">
              你正在为TA挑选一首歌
            </div>
          </div>
          <div
            onClick={() => setAt(null)}
            className="absolute w-10 px-1 text-center transition border rounded cursor-pointer select-none text-normal right-2 text-xxs active:text-gray-900 dark:active:text-gray-100 active:bg-opacity-60"
            style={{ borderColor: "var(--font-normal)" }}
          >
            取消
          </div>
        </div>
      ) : null}
      <RightHead title="点歌" />
      <MInput onSearch={onSearch} />
      <div
        className="absolute bottom-0 left-0 right-0 overflow-y-auto m_scroll"
        style={{ top: 120 }}
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
              <span className="py-4">搜索失败</span>
            ) : !!!err && !loading && data?.length == 0 ? (
              <span className="py-4">世界的尽头</span>
            ) : null}
          </h2>
          {param.isHot ? <div className="pl-2">本周热门点播</div> : null}
          {loading && param.isHot ? <div className="py-40"></div> : null}
          {data?.map((item: any, index: number) => (
            // 单个
            <Spin spinning={item?.loading ?? false} key={index}>
              <div
                key={index}
                className="relative flex flex-1 px-2 py-2 m-2 transition rounded hover:bg-select"
              >
                <img className="w-12 h-12 rounded" src={item?.pic} alt="" />
                <div className="w-2/3 pl-2">
                  <div className="truncate">
                    {!!item?.week ? (
                      <span className="text-primary">({item?.week})</span>
                    ) : null}
                    {item?.name}
                  </div>
                  <div className="pt-2 truncate text-xxs text-light">
                    {item?.singer}
                  </div>
                </div>
                <div
                  onClick={() => addSongHandle(item.mid, index)}
                  className="absolute w-10 px-1 text-center transition border rounded cursor-pointer select-none right-2 text-xxs active:text-gray-900 dark:active:text-gray-100 active:bg-opacity-60"
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
