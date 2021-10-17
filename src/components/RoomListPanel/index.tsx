import {
  message,
  Select,
  Spin,
  Tooltip,
  AutoComplete,
  Input,
  Button,
} from "antd";
import { hotRooms } from "api/room";
import { useFetch } from "hooks/useFetch";
import SvgIcon from "components/SvgIcon";
import { useCoreModel } from "models/coreModule";
import React, { useState } from "react";
import { classNames, local, roomHisCache, ROOM_HIS_KEY } from "utils";
import CST, { POPKEY } from "utils/CST";

import _ from "./index.module.css";
import { MInput } from "components/MInput";
import { HideAllIcon } from "components/HideAllIcon";

export const RightHead = ({ title = "" }) => {
  return (
    <div className="flex items-center justify-between py-3 text-2xl">
      <div
        onClick={() => useCoreModel.data?.showDialog(POPKEY.ROOM_CREATE)}
        className="px-2 border rounded cursor-pointer"
        style={{ borderColor: "var(--font-normal)" }}
      >
        创建房间
      </div>
      <div>{title}</div>
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
export const RoomListPanel: React.FC = ({ children }) => {
  const { data, setData, loading, fetching, err } = useFetch(hotRooms);
  const [roomHis, setRoomHis] = useState(local.get(ROOM_HIS_KEY, []));
  // 搜索处理
  const onSearch = async (v: any) => {
    fetching().catch((e) => {
      message.error("搜索失败");
    });
  };
  // 加入房间
  const joinRoom = (roomId: any, index?: number) => {
    if (roomId == useCoreModel?.data?.roomId) {
      return useCoreModel?.data?.hdieAll();
    }
    useCoreModel.data
      ?.changeRoom(roomId)
      .then((info: any) => {
        useCoreModel.data?.hdieAll();
      })
      .catch((e) => {});
  };

  const options = roomHis.map((d: any) => ({
    value: `ID:${d.room_id}  ${d.room_name}`,
    id: d.room_id,
  }));
  return (
    <RightPanelWrapper>
      <RightHead title="房间" />
      <AutoComplete
        dropdownClassName="certain-category-search-dropdown"
        style={{ width: "100%" }}
        options={options}
        onSelect={(v, opt) => {
          joinRoom(opt.id);
        }}
        children={
          <MInput hint="输入房间号" btnTxt="进入" onSearch={joinRoom} />
        }
      />

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
              <span className="py-4">数据拉取失败</span>
            ) : !!!err && !loading && data?.length == 0 ? (
              <span className="py-4">世界的尽头</span>
            ) : null}
          </h2>
          {loading ? <div className="py-40"></div> : null}
          {data?.map((item: any, index: number) => (
            // 单个
            <Spin spinning={item?.loading ?? false} key={index}>
              <div
                key={index}
                onClick={() => joinRoom(item?.room_id, index)}
                className="relative flex flex-col flex-1 px-2 py-2 m-2 transition rounded cursor-pointer hover:bg-select"
              >
                <div className="flex items-center pb-2">
                  <Tooltip title="房间类型">
                    <SvgIcon
                      name={
                        item?.room_type == 1
                          ? "erji"
                          : item?.room_type == 4
                          ? "voice"
                          : "erji"
                      }
                      className="mr-1 text-lg cursor-pointer text-primary"
                    />
                  </Tooltip>
                  <div>{item?.room_name}</div>
                  <div
                    className="px-1 ml-auto border rounded text-primary"
                    style={{ borderColor: "var(--primary)" }}
                  >
                    {item?.room_public == 1 ? (
                      <SvgIcon
                        name="Octiconslock"
                        className="inline-block text-primary"
                      />
                    ) : null}
                    ID:{item?.room_id}
                  </div>
                </div>
                <div className="relative flex flex-1 rounded bg-bg-light">
                  <img
                    className="w-12 h-12 rounded"
                    src={CST.static_url + item?.user_head}
                    alt=""
                  />
                  <div className="w-5/6 pl-2">
                    <div className="truncate">
                      <span className="text-primary">
                        ({item?.room_online + 2})
                      </span>
                      {item?.user_name}
                    </div>
                    <div className="pt-2 truncate text-xxs text-light">
                      {item?.room_notice}
                    </div>
                  </div>
                </div>
              </div>
            </Spin>
          ))}
        </Spin>
      </div>
    </RightPanelWrapper>
  );
};
