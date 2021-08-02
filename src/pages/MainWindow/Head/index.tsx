import { Tooltip } from 'antd';
import React from 'react';

export const Head: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2 text-lg border-b border-gray-300 dark:border-gray-600" style={{ backgroundColor: "transparent" }}>
      <Tooltip title="房间ID(房间号)">
        <span className="px-1 text-sm font-bold border border-red-500 rounded-sm tag" style={{ color: "var(--primary)" }}>ID:888</span>
      </Tooltip>
      <span className="flex items-center room_name">
        <Tooltip title="当前为点歌房">
          <svg className="text-xl icon" style={{ color: "var(--primary)" }} aria-hidden="true">
            <use xlinkHref="#icon-erji"></use>
          </svg>
        </Tooltip>
        <span className="text-sm font-bold">
          点歌大厅
          (
          <Tooltip title="在线人数">
            <span style={{ color: "var(--primary)" }} className="cursor-pointer">
              <span className="text-current">119</span>
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

