import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { classNames, timeago } from 'utils';

import _ from './index.module.css';
import { useCoreModel } from 'models/coreModule';
import { useUserModel } from 'models/userModel';
import CST, { MT, POPKEY } from 'utils/CST';
import { mo } from 'api/message';
import { useSocketModel } from 'models/socketModel';
import { Button, Popover } from 'antd';
import { createPortal } from 'react-dom';


export const PortalWidget: React.FC<any> = ({ children, ...props }) => {
  return createPortal(<div {...props}>{children}</div>, document.body)
}

interface IMsgItemParam {
  isMe?: boolean;
  showTime: boolean;
  msgItem: IMsgItme;
}
const AvatarMenu = ({ user }: any) => {
  const { setAt, showDialog } = useCoreModel(model => []);
  const { user_id, user_name } = user;
  const handleSendsong = () => {
    setAt({ user_id, user_name, type: 0 });// 送歌@
    showDialog(POPKEY.SEARCH);
  }
  return (
    <div className="flex flex-col bg-bg-light text-icon-normal">
      <div className="px-2 py-1 cursor-pointer hover:text-primary" onClick={() => setAt({ user_id, user_name, type: 1 })}>@TA</div>
      <div className="px-2 py-1 cursor-pointer hover:text-primary" onClick={handleSendsong}>送歌</div>
      <div className="px-2 py-1 cursor-pointer hover:text-primary" onClick={() => showDialog(POPKEY.PROFILE)}>主页</div>
    </div>
  );
}
const MsgItem: React.FC<IMsgItemParam> = ({ isMe = false, msgItem, showTime }) => {
  const { room } = useSocketModel(model => [model.room]);
  const touch = (e: any) => {
    if (!e.target.classList.contains("head_bounce")) {
      e.target.classList.add("head_bounce");
    }
    mo({ room_id: room['room']?.room_id, at: user?.user_id }).catch(e => { });
  }
  const { message_type: type, message_content: content, user } = msgItem;
  const handleMenu = () => { }
  return (
    <>
      <div className={classNames("msg_item mb-6", isMe ? _.me : "")}>
        {showTime ? <div className="my-2 text-center time" style={{ fontSize: 12 }}>{timeago(msgItem.message_createtime * 1000)}</div> : null}
        <div className={classNames("flex", _.msg_item_main)}>
          {!isMe ? <Popover placement="bottomRight" color="var(--bg-light)" destroyTooltipOnHide className={classNames("inline w-10 h-10 bg-red-500 cursor-pointer head_bounce", _.head)} content={<AvatarMenu user={user} />}>
            <img onContextMenu={handleMenu} src={CST.server_host + user?.user_head} alt="" onDoubleClick={e => touch(e)} onAnimationEnd={(e: any) => e.target.classList.remove("head_bounce")} /> { /* 头像 */}
          </Popover> :
            <img onContextMenu={handleMenu} className={classNames("inline w-10 h-10 bg-red-500 cursor-pointer head_bounce", _.head)} src={CST.server_host + user?.user_head} alt="" onDoubleClick={e => touch(e)} onAnimationEnd={(e: any) => e.target.classList.remove("head_bounce")} />}
          <div onContextMenu={handleMenu} className={classNames(_.msg_item_main_info)}>{ /* 区别 */}
            {isMe ? null : <div className={_.name}><span>{user?.user_name}</span></div>}
            <div className={classNames(" max-w-sm px-3 py-2 bg-bgc relative rounded-sm", _.content)}>
              {
                type == "text" ? content : type == "img" ? (<img src={CST.server_host + content} />) : null
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
const NoticeMsg = ({ noticeItem, showTime = false }: { noticeItem: any, showTime: boolean }) => {
  const [content, setContent] = useState<string | ReactNode>("");
  useEffect(() => {
    const data = noticeItem?.data;
    switch (noticeItem?.type) {
      case MT.TOUCH:
        setContent(`${data['user']?.user_name} 摸了摸 ${data['at']?.user_name} ${data['at']?.user_touchtip}`)
        break;
      case MT.ADD_SONG:
        const fromName = data['user']?.user_name;
        const atName = data['at']?.user_name;
        const songName = data['song']?.name;
        setContent(`${fromName}${!!atName ? `害羞的为 ${atName}` : ''}点了一首${songName}`);
        break;
      case MT.PUSH:
        setContent(`${data['user']?.user_name}顶了一下${data['song']?.name}`);
        break;
      case MT.PASS:
        setContent(`呀，${data['content']}`);
        break;
      case MT.SYSTEM:
        setContent(`${data['content']}`)
        break;
      case MT.BACK:
        setContent(`${data['user']?.user_name}撤回了一条消息！`);
        break;
      case MT.CLEAR:
        setContent(`${data['user']?.user_name}清除了聊天消息！`);
        break;
      case MT.JOIN:
        const userType = data['userType'];
        const where = data['where'];
        const sufix = <span>{userType == 0 ? <span onClick={() => { console.log("显示用户个人中心") }} className="cursor-pointer text-primary"> {data?.name} </span> : userType == 1 ? data['plat'] : '临时'}用户</span>;
        setContent(<span>欢迎{`来自${where}的`}{sufix}</span>)
        break;
      case MT.SHUT_DOWN:
      case MT.REMOVE_BAN:
        const banFromName = data['user']?.user_name;
        const banName = data['ban']?.user_name;
        const msg = data['msg'];
        setContent(`${banName} 被 ${msg}，操作人 ${banFromName}`);
        break;
    }
  }, [])
  return <div className="pb-5 text-center text-xxs" style={{ color: "#999" }}>
    {showTime ? <div className="pb-5 text-center time" style={{ fontSize: 12 }}>{timeago(noticeItem?.timestamp)}</div> : null}
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
  timestamp: number;
  data: any;
  id: string;
}
export const MessageList: React.FC = () => {
  const boxRef = useRef<any>();
  const { msgs } = useCoreModel(model => [model.msgs]);
  const { user } = useUserModel(model => [model.user]);
  useEffect(() => {
    boxRef.current.scrollTo(0, boxRef.current?.scrollHeight);
  }, [msgs])
  return (
    <div ref={boxRef} className={classNames("flex-grow px-6 py-3 overflow-y-scroll bg-transparent m_scroll overscroll-none", _.msglist)}>
      {
        msgs?.map((item: IMsgItme, index: number) => {
          let showTime = true;
          if (index >= 1) {
            showTime = (item.timestamp - (msgs[index - 1].timestamp)) > 5000;
          }
          if (item?.type) {
            return <NoticeMsg key={item?.id} noticeItem={item} showTime={showTime} />
          }
          const isMe = item.message_user == user.user_id;
          return <MsgItem key={item?.message_id} isMe={isMe} msgItem={item} showTime={showTime}></MsgItem>
        })
      }
    </div>
  );
}