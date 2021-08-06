import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { classNames } from 'utils';

import _ from './index.module.css';
import { useCoreModel } from 'models/coreModule';
import { useUserModel } from 'models/userModel';
import CST, { MT } from 'utils/CST';


interface IMsgItemParam {
  isMe?: boolean;
  showTime: boolean;
  msgItem: IMsgItme;
}
const MsgItem: React.FC<IMsgItemParam> = ({ isMe = false, msgItem, showTime }) => {
  const touch = (e: any) => {
    if (!e.target.classList.contains("head_bounce")) {
      e.target.classList.add("head_bounce");
    }
  }
  const { message_type: type, message_content: content, user } = msgItem;
  return (
    <div className={classNames("msg_item mb-6", isMe ? _.me : "")}>
      {showTime ? <div className="my-2 text-center time" style={{ fontSize: 12 }}>15:30</div> : null}
      <div className={classNames("flex", _.msg_item_main)}>
        <img className={classNames("inline w-10 h-10 bg-red-500 cursor-pointer head_bounce", _.head)} src={CST.server_host + user?.user_head} alt="" onDoubleClick={e => touch(e)} onAnimationEnd={(e: any) => e.target.classList.remove("head_bounce")} /> { /* 头像 */}
        <div className={classNames(_.msg_item_main_info)}>{ /* 区别 */}
          {isMe ? null : <div className={_.name}><span>{user?.user_name}</span></div>}
          <div className={classNames(" max-w-sm px-3 py-2 bg-bgc relative rounded-sm", _.content)}>
            {
              type == "text" ? content : type == "img" ? (<img src={CST.server_host + content} />) : null
            }
          </div>
        </div>
      </div>
    </div>
  );
}
const NoticeMsg = ({ noticeItem }: { noticeItem: any }) => {
  const [content, setContent] = useState("");
  useEffect(() => {
    const data = noticeItem?.data;
    switch (noticeItem?.type) {
      case MT.TOUCH:
        setContent(`${data['user']?.user_name} 摸了摸 ${data['at']?.user_name} ${data['at']?.user_touchtip}`)
    }
  }, [])
  return <div className="my-4 text-center text-xxs" style={{ color: "#999" }}>
    {content}
  </div>
}

interface IMsgItme {
  // 聊天消息
  message_content: string;// "hello alert('Xss来了')"
  message_createtime: number;// 1627455528
  message_id: number;// 5
  message_status: string;// 0
  message_to: number;// 888
  message_type: string;// "text"
  message_updatetime: string;// 1627455528
  message_user: number;// 100006
  message_where: string;// "channel"
  user: any;
  // 通知消息
  type: string;
  timestamp: string;
  data: any;
}
export const MessageList: React.FC = () => {
  const boxRef = useRef<any>();
  const { msgs } = useCoreModel();
  const { user } = useUserModel();
  useLayoutEffect(() => {
    console.log(boxRef.current);
    console.log(boxRef.current?.scrollHeight);
    boxRef.current.scrollTo(0, boxRef.current?.scrollHeight + 20);
  }, [msgs])
  // TODO:====================key 渲染问题================
  return (
    <div ref={boxRef} className={classNames("flex-grow px-6 py-3 overflow-y-scroll bg-transparent m_scroll overscroll-none", _.msglist)}>
      {
        msgs?.map((item: IMsgItme, index: number) => {
          if (item?.type) {
            return <NoticeMsg key={Date.now()} noticeItem={item} />
          }
          const isMe = item.message_user == user.user_id;
          let showTime = true;
          if (index >= 1) {
            showTime = (item.message_createtime - msgs[index - 1].message_createtime) > 300;
          }
          return <MsgItem key={item?.message_id} isMe={isMe} msgItem={item} showTime={showTime}></MsgItem>
        })
      }
    </div>
  );
}