import { message, Spin, Tooltip } from 'antd';
import { hotRooms } from 'api/room';
import { addSong, ISearchSongParam, searchSong } from 'api/song';
import { useFetch } from 'components/AddSongPanel';
import { MInput } from 'components/MInput';
import { MPopoverContext } from 'components/MPopover';
import SvgIcon from 'components/SvgIcon';
import { useCoreModel } from 'models/coreModule';
import { useSocketModel } from 'models/socketModel';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { classNames } from 'utils';
import CST from 'utils/CST';

import _ from './index.module.css';

export const RightHead = ({ title = "" }) => {
  return (
    <div className="py-3 text-2xl">
      {title}
    </div>
  );
}


export const RightPanelWrapper: React.FC = ({ children }) => {
  return <div onClick={(e) => e.stopPropagation()} style={{ width: 400 }} className="absolute top-0 bottom-0 right-0 h-full p-2 shadow-2xl bg-bgc">
    {children}
  </div>
}
interface IRoomListPanel {

}
export const RoomListPanel: React.FC<IRoomListPanel> = ({ children }) => {
  const { roomAuth, room } = useSocketModel();
  const { changeRoom, hdieAll } = useCoreModel();
  const { data, setData, loading, fetching, err } = useFetch(hotRooms);

  // 搜索处理
  const onSearch = async (v: any) => {
    fetching().catch(e => {
      message.error("搜索失败");
    });
  }
  // 加入房间
  const joinRoom = (roomId: any, index: number) => {
    console.log(room, roomId);
    if (roomId == room.room.room_id) {
      return hdieAll();
    }
    changeRoom(roomId).then(() => {
      hdieAll();
    })
  }


  return <RightPanelWrapper>
    <RightHead title="点歌" />
    <MInput onSearch={onSearch} hint="房间号" />
    <div className="absolute bottom-0 left-0 right-0 overflow-y-auto m_scroll" style={{ top: 120 }}>
      <Spin spinning={loading}  >
        <h2 className={classNames(`text-2xl text-center text-current ${(loading && data?.length == 0) ? 'pt-20' : ''}`)}>
          {
            (!!err && !loading) ? <span className="py-4">数据拉取失败</span> : (!!!err && !loading && data?.length == 0) ? <span className="py-4">世界的尽头</span> : null
          }
        </h2>
        {loading ? <div className="py-40"></div> : null}
        {data?.map((item: any, index: number) => (
          // 单个
          <Spin spinning={item?.loading ?? false} key={index}>
            <div key={index} onClick={() => joinRoom(item?.room_id, index)} className="relative flex flex-col flex-1 px-2 py-2 m-2 rounded-sm cursor-pointer bg-bg-light">
              <div className="flex items-center pb-2">
                <Tooltip title="房间类型">
                  <SvgIcon name={item?.room_type == 1 ? "erji" : item?.room_type == 4 ? "voice" : "erji"} className="mr-1 text-lg cursor-pointer text-primary" />
                </Tooltip>
                <div>{item?.room_name}</div>
                <div className="px-1 ml-auto border rounded-sm text-primary" style={{ borderColor: "var(--primary)" }}>ID:{item?.room_id}</div>
              </div>
              <div className="relative flex flex-1 rounded-sm bg-bg-light">
                <img className="w-12 h-12 rounded-sm" src={CST.server_host + item?.user_head} alt="" />
                <div className="w-5/6 pl-2">
                  <div className="truncate">
                    {!!item?.room_online ? <span className="text-primary">({item?.room_online})</span> : null}
                    {item?.user_name}
                  </div>
                  <div className="pt-2 truncate text-xxs text-light">{item?.room_notice}</div>
                </div>
              </div>
            </div>
          </Spin>
        ))}
      </Spin>
    </div>
  </RightPanelWrapper>
}