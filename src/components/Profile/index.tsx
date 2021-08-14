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

export const RightHead = ({ title = "" }) => {
  return <div className="py-3 text-2xl">{title}</div>;
};

export const RightPanelWrapper: React.FC = ({ children }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ width: 400 }}
      className="absolute top-0 bottom-0 right-0 h-full p-2 shadow-2xl bg-bgc"
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
        <Spin spinning={loading}>
          <div
            style={{ height: 220 }}
            className="flex flex-col items-center justify-between w-full p-4 pb-1 space-y-2 text-center bg-bgc"
          >
            {data?.user_head ? (
              <img
                className="w-12 h-12 rounded-md"
                src={CST.static_url + data?.user_head}
                alt=""
              />
            ) : (
              <div className="h-12"></div>
            )}
            <div className="flex items-center space-x-1">
              <span className="border">ID:{data?.user_id}</span>
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
            <div>{data?.user_name}</div>
            <div className="dot2">{data?.user_remark}</div>
            <div className="self-start text-left">TA最近在听的歌</div>
          </div>
        </Spin>
        <div className="relative flex-grow w-full bg-bgc">
          <Spin spinning={listLoading}>
            <div className="w-full h-16"></div>
          </Spin>
          <div className="absolute top-0 bottom-0 left-0 right-0 overflow-y-auto m_scroll">
            {songs?.list?.map((item: any) => (
              <div
                key={item?.song_id}
                className="flex items-center p-2 bg-bg-light"
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
          className="flex justify-end w-full bg-bgc"
          style={{ height: "8%" }}
        >
          <div
            className="self-center px-2 mr-2 border cursor-pointer"
            onClick={goRoom}
          >
            去TA房间看看
          </div>
        </div>
      </div>
    </RightPanelWrapper>
  );
};
