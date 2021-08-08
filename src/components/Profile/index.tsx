import { message, Spin, Tooltip } from 'antd';
import { hotRooms } from 'api/room';
import { userInfo } from 'api/user';
import { useFetch } from 'components/AddSongPanel';
import { MInput } from 'components/MInput';
import SvgIcon from 'components/SvgIcon';
import { useCoreModel } from 'models/coreModule';
import { useSocketModel } from 'models/socketModel';
import { useUserModel } from 'models/userModel';
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
interface IProfilePanel {

}
export const ProfilePanel: React.FC<IProfilePanel> = ({ children }) => {
  const { u, su } = useUserModel(model => [model.u]);
  const { loading, data, setData, fetching } = useFetch(userInfo, u, { init: false });
  useEffect(() => {
    if (!!u) {
      fetching();
    }
    return () => {
      su(null);
    }
  }, [u])
  return <RightPanelWrapper>
    <div className="absolute top-0 bottom-0 left-0 right-0 h-full">
      <Spin spinning={loading}>
        <div className="flex flex-col items-center justify-between w-full p-4 pb-1 space-y-2 text-center bg-bgc" style={{ height: "37%" }}>
          {data?.user_head ? <img className="w-12 h-12 rounded-md" src={CST.static_url + data?.user_head} alt="" /> : <div className="h-12"></div>}
          <div className="flex items-center space-x-1">
            <span className="border">ID:{data?.user_id}</span>
            <span className="border">QQ</span>
            <SvgIcon name="girl" className="text-lg" />
            <SvgIcon name="iconfontwindows" />
          </div>
          <div>{data?.user_name}</div>
          <div className="dot2">{data?.user_remark}</div>
          <div className="self-start text-left">TA最近在听的歌</div>
        </div>
      </Spin>
      <div className="relative w-full bg-bgc" style={{ height: "55%" }}>
        <div className="absolute top-0 bottom-0 left-0 right-0 overflow-y-auto m_scroll">
          {
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14].map(item => (
              <div key={item} className="flex items-center p-2 bg-bg-light">
                <div className="flex flex-col items-start justify-between space-y-2">
                  <span>个你们</span>
                  <span>忠于</span>
                </div>
                <div className="ml-auto">12次</div>
              </div>
            ))
          }
        </div>

      </div>
      <div className="flex justify-end w-full bg-bgc" style={{ height: "8%" }}>
        <div className="self-center border">去TA房间看看</div>
      </div>
    </div>
  </RightPanelWrapper>
}