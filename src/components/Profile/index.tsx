import { message, Spin } from "antd";
import { userSongs } from "api/song";
import { userInfo } from "api/user";
import { useFetch } from "hooks/useFetch";
import SvgIcon from "components/SvgIcon";
import { UActionType, useCoreModel } from "models/coreModule";
import React, { useEffect } from "react";
import { classNames } from "utils";
import CST from "utils/CST";

import _ from "./index.module.css";
import { HideAllIcon } from "components/HideAllIcon";

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
interface IProfilePanel {}
export const ProfilePanel: React.FC<IProfilePanel> = () => {
  const { u, udsp } = useCoreModel((model) => [model.u]);
  const { loading, data, setData, fetching } = useFetch(userInfo, u, {
    init: false,
  });
  const {
    loading: listLoading,
    data: songs,
    fetching: songsFetching,
  } = useFetch(userSongs, { user_id: u }, { init: false });
  useEffect(() => {
    if (!!u) {
      fetching();
      songsFetching();
    }
    return () => {
      udsp({ type: UActionType.SU });
    };
  }, [u]);
  const goRoom = () => {
    if (!!!data?.room) return message.info("他还没有自己的房间");
    useCoreModel.data?.hdieAll();
    useCoreModel.data?.changeRoom(data.room?.room_id);
  };
  return (
    <RightPanelWrapper>
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col h-full">
        <div className="absolute z-10 text-2xl top-2 right-3">
          <HideAllIcon />
        </div>
        <Spin spinning={loading}>
          <div
            style={{ height: 220 }}
            className="flex flex-col items-center justify-between w-full p-4 pb-1 space-y-2 text-center bg-main"
          >
            {data?.user_head ? (
              <img
                className="w-16 h-16 rounded"
                src={CST.static_url + data?.user_head}
                alt=""
              />
            ) : (
              <div className="h-16"></div>
            )}
            <div className="flex items-center space-x-1">
              <span className="px-2 border rounded border-primary text-primary">
                ID:{data?.user_id}
              </span>
              <span className="border">{data?.plat}</span>
              <i
                className="cursor-pointer text-icon-normal"
                title={data?.user_sex == 0 ? "boy" : "girl"}
              >
                <SvgIcon
                  name={data?.user_sex == 0 ? "boy" : "girl"}
                  className={classNames(
                    "text-lg",
                    data?.user_sex == 0 ? _.boy : _.girl
                  )}
                />
              </i>
              <i
                className="cursor-pointer text-icon-normal"
                title={data?.user_device == "mac" ? "Mac在线" : "Windows在线"}
              >
                <SvgIcon
                  name={data?.user_device == "mac" ? "mac" : "iconfontwindows"}
                />
              </i>
            </div>
            <div className="text-lg">{data?.user_name}</div>
            <div className="dot2 text-light">{data?.user_remark}</div>
            <div className="self-start text-left">TA最近在听的歌</div>
          </div>
        </Spin>
        <div className="relative flex-grow w-full bg-main">
          <Spin spinning={listLoading}>
            <div className="w-full h-16"></div>
          </Spin>
          <div className="absolute top-0 bottom-0 left-0 right-0 overflow-y-auto m_scroll">
            {songs?.list?.map((item: any) => (
              <div
                key={item?.song_id}
                className="flex items-center p-2 m-2 rounded bg-select"
              >
                <div className="flex flex-col items-start justify-between space-y-2">
                  <span>{item?.song_name ?? "--"}</span>
                  <span>{item?.song_singer ?? "--"}</span>
                </div>
                <div className="ml-auto text-primary">
                  {item?.song_play ?? "--"}次
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="flex justify-end w-full bg-main"
          style={{ height: "8%" }}
        >
          <div
            className="self-center px-2 mr-2 border rounded cursor-pointer"
            onClick={goRoom}
          >
            去TA房间看看
          </div>
        </div>
      </div>
    </RightPanelWrapper>
  );
};
