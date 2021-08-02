
import { Tooltip } from 'antd';
import React from 'react';
import _ from './index.module.css';
import { classNames } from 'utils';

// 播放进度
const MProcess: React.FC = () => {
  const process = 80;
  return (
    <Tooltip title="进度">
      <div className="absolute bottom-0 left-0 right-0 bg-green-800 w-ful" style={{ height: 2 }}>
        <div className={classNames(_.process_inner, "bg-green-300 relative")} style={{ width: `${80}%`, height: 2 }}></div>
      </div>
    </Tooltip>
  );
}

export const MessageInput: React.FC = () => {

  return (
    <div className="h-32 bg-transparent">
      <div className="relative flex items-center h-8 px-2 space-x-2">
        <Tooltip title="表情">
          <svg className="text-2xl icon" fill="var(--normal-icon)" aria-hidden="true">
            <use xlinkHref="#icon-biaoqing"></use>
          </svg>
        </Tooltip>
        <Tooltip title="图片">
          <svg className="text-2xl icon" fill="var(--normal-icon)" aria-hidden="true">
            <use xlinkHref="#icon-tupian"></use>
          </svg>
        </Tooltip>
      </div>
      <div className="relative h-24">
        <textarea className="w-full bg-transparent border-0 outline-none h-18"></textarea>
        <Tooltip title="点击复制">
          <span className="absolute cursor-pointer bottom-1 left-2" style={{ fontSize: 12 }}>歌词显示</span>
        </Tooltip>
        <button className="absolute px-4 py-2 bg-gray-100 rounded-sm outline-none bottom-2 right-2 dark:bg-gray-500 active:bg-gray-200 dark:active:bg-gray-600">发送(Enter)</button>
        <MProcess />
      </div>
    </div>
  );
}