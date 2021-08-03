import React, { ReactNode } from 'react';
import { classNames } from 'utils';

import _ from './index.module.css';
import head from '../../../../assets/queue.svg'


interface IMsgItem {
  isMe?: boolean
}
const MsgItem: React.FC<IMsgItem> = ({ isMe = false }) => {
  const touch = (e: any) => {
    if (!e.target.classList.contains("head_bounce")) {
      e.target.classList.add("head_bounce");
    }
  }
  return (
    <div className={classNames("msg_item mb-6", isMe ? _.me : "")}>
      <div className="my-2 text-center time" style={{ fontSize: 12 }}>15:30</div>
      <div className={classNames("flex", _.msg_item_main)}>
        <img className={classNames("inline w-10 h-10 bg-red-500 cursor-pointer head_bounce", _.head)} src={head} alt="" onDoubleClick={e => touch(e)} onAnimationEnd={(e: any) => e.target.classList.remove("head_bounce")} /> { /* 头像 */}
        <div className={classNames(_.msg_item_main_info)}>{ /* 区别 */}
          {isMe ? null : <div className={_.name}><span>willian</span></div>}
          <div className={classNames("max-w-md px-3 py-2 bg-bgc relative rounded-sm", _.content)}>
            <img src="https://bbbug.hamm.cn/uploads/thumb/image/20210803/1dd99e06af3bc8c9ed54e4e637c54a53.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
const NoticeMsg = ({ msg = "default" }: { msg: string | ReactNode }) => {
  return <div className="my-4 text-center text-xxs" style={{ color: "#999" }}>
    {msg}
  </div>
}
export const MessageList: React.FC = () => {
  return (
    <div className={classNames("flex-grow px-6 py-3 overflow-y-scroll bg-transparent", _.msglist)}>
      <MsgItem />
      <MsgItem isMe />
      <MsgItem />
      <NoticeMsg msg="一方 点了一首 《小丑》(程炳杰)" />
      <NoticeMsg msg="一方 点了一首 《小丑》(程炳杰)" />
      <NoticeMsg msg="一方 点了一首 《小丑》(程炳杰)" />
      <NoticeMsg msg="一方 点了一首 《小丑》(程炳杰)" />
      <NoticeMsg msg="一方 点了一首 《小丑》(程炳杰)" />
    </div>
  );
}