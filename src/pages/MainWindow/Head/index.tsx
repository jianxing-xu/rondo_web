import { Tooltip } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { useCoreModel } from 'models/coreModule';
import { useSocketModel } from 'models/socketModel';
import React from 'react';
import { POPKEY } from 'utils/CST';

export const Head: React.FC = () => {
  const { room } = useSocketModel(model => [model.room]);
  const { now, showDialog } = useCoreModel(model => model.now);
  return (
    <div className="flex items-center justify-between px-4 py-2 text-lg border-b border-gray-300 dark:border-gray-600" style={{ backgroundColor: "transparent" }}>
      <Tooltip title="房间ID(房间号)">
        <span className="px-1 text-sm font-bold border border-red-500 rounded-sm tag" style={{ color: "var(--primary)" }}>ID:{room?.room.room_id}</span>
      </Tooltip>
      <span onClick={() => showDialog(POPKEY.ROOM_SETTING)} className="absolute flex items-center text-sm cursor-pointer select-none left-24">
        <SvgIcon name="xingzhuang604" className="text-sm" />
        <span style={{ paddingLeft: 2 }}>管理</span>
      </span>
      <span className="flex items-center room_name">
        <Tooltip title="房间类型">
          <svg className="text-xl icon" style={{ color: "var(--primary)" }} aria-hidden="true">
            <use xlinkHref="#icon-erji"></use>
          </svg>
        </Tooltip>
        <span className="text-sm font-bold">
          {room?.room?.room_name}
          (
          <Tooltip title="在线人数">
            <span onClick={() => showDialog(POPKEY.ONLINE_LIST)} style={{ color: "var(--primary)" }} className="cursor-pointer">
              <span className="text-current">{(now?.onlineCount || 0) + 2}</span>
              <svg className="inline icon" aria-hidden="true">
                <use xlinkHref="#icon-PersonalCenteron"></use>
              </svg>
            </span>
          </Tooltip>
          )

        </span>
      </span>
      <span>
        {/* <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-PersonalCenteron"></use>
        </svg> */}
      </span>
    </div>
  );
}

