import React, { ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { classNames, debounce, throttle, timeago } from 'utils';

import _ from './index.module.css';
import { useCoreModel } from 'models/coreModule';
import { useUserModel } from 'models/userModel';
import CST, { MT, POPKEY } from 'utils/CST';
import { backMessage, mo } from 'api/message';
import { useSocketModel } from 'models/socketModel';
import { Popover, notification, message } from 'antd';
import { createPortal } from 'react-dom';
import { useGlobalModel } from 'models/globalModel';
import { noticePlayer } from 'models/audioModel';
import { MessageInput } from '../MessageInput';


export const PortalWidget: React.FC<any> = ({ children, ...props }) => {
  return createPortal(<div {...props}>{children}</div>, document.body)
}

interface IMsgItemParam {
  isMe?: boolean;
  showTime: boolean;
  msgItem: IMsgItme;
}
// 头像下拉次啊单
const AvatarMenu = ({ user }: any) => {
  const { setAt, showDialog } = useCoreModel(model => []);
  const { su } = useUserModel(model => []);
  const { user_id, user_name, user_head } = user;
  const handleSendsong = () => {
    setAt({ user_id, user_name, type: 0, user_head });// 送歌@
    showDialog(POPKEY.SEARCH);
  }
  return (
    <div className="flex flex-col bg-bg-light text-icon-normal">
      <div className="px-2 py-1 cursor-pointer hover:text-primary" onClick={() => setAt({ user_id, user_name, user_head, type: 1 })}>@TA</div>
      <div className="px-2 py-1 cursor-pointer hover:text-primary" onClick={handleSendsong}>送歌</div>
      <div className="px-2 py-1 cursor-pointer hover:text-primary" onClick={() => {
        su(user_id);
        showDialog(POPKEY.PROFILE);
      }}>主页</div>
    </div>
  );
}
// 消息项
const MsgItem: React.FC<IMsgItemParam> = ({ isMe = false, msgItem, showTime }) => {
  const { room } = useSocketModel(model => [model.room]);
  //消息时间格式化
  const time = useMemo(() => {
    return timeago(msgItem.message_createtime * 1000);
  }, [msgItem.message_createtime])
  // 摸一摸处理
  const touch = (e: any) => {
    if (!e.target.classList.contains("head_bounce")) {
      e.target.classList.add("head_bounce");
    }
    mo({ room_id: room['room']?.room_id, at: user?.user_id }).catch(e => { });
  }
  const { message_type: type, message_content: content, user, loading, message_id } = msgItem;
  const handleMenu = () => { }
  // 处理撤回消息
  const handleBack = () => {
    backMessage(room['room']?.room_id, message_id).then(() => { })
  }

  return (
    <>
      <div className={classNames("msg_item mb-6", isMe ? _.me : "")}>
        {showTime ? <div className="my-2 text-center time" style={{ fontSize: 12 }}>{time}</div> : null}
        <div className={classNames("flex", _.msg_item_main)}>
          {!isMe ? <Popover trigger="click" placement="bottom" color="var(--bg-light)" destroyTooltipOnHide className={classNames("inline w-10 h-10 bg-red-500 cursor-pointer head_bounce", _.head)} content={<AvatarMenu user={user} />}>
            <img onContextMenu={handleMenu} src={CST.static_url + user?.user_head} alt="" onDoubleClick={e => touch(e)} onAnimationEnd={(e: any) => e.target.classList.remove("head_bounce")} /> { /* 头像 */}
          </Popover> :
            <img onContextMenu={handleMenu} className={classNames("inline w-10 h-10 bg-gray-400 cursor-pointer", _.head)} src={CST.static_url + user?.user_head} alt="" onDoubleClick={e => touch(e)} onAnimationEnd={(e: any) => e.target.classList.remove("head_bounce")} />}
          {
            isMe ? <Popover destroyTooltipOnHide color="var(--bg-light)" trigger="click" placement="bottom" className={classNames(_.msg_item_main_info,)} content={<div className="cursor-pointer text-icon-normal" onClick={handleBack}>撤回</div>} >
              <div onContextMenu={handleMenu} className="cursor-pointer" >{ /* 区别 */}
                {isMe ? null : <div className={_.name}><span>{user?.user_name}</span></div>}
                <div className={classNames("max-w-sm px-3 py-2 bg-bgc relative rounded-sm", _.content, loading ? _.loading : '')}>
                  {
                    type == "text" ? content : type == "img" ? (<img src={CST.static_url + content} />) : null
                  }
                </div>
              </div>
            </Popover> : <div className={classNames(_.msg_item_main_info,)} onContextMenu={handleMenu} >{ /* 区别 */}
              {isMe ? null : <div className={_.name}><span>{user?.user_name}</span></div>}
              <div className={classNames("max-w-sm px-3 py-2 bg-bgc relative rounded-sm", _.content, loading ? _.loading : '')}>
                {
                  type == "text" ? content : type == "img" ? (<img src={CST.static_url + content} />) : null
                }
              </div>
            </div>
          }
        </div>
      </div>
    </>
  );
}
// 通知消息
const NoticeMsg = ({ noticeItem, showTime = false }: { noticeItem: any, showTime: boolean }) => {
  const [content, setContent] = useState<string | ReactNode>("");
  const g = useGlobalModel.data;
  const u = useUserModel.data?.user;
  useEffect(() => {
    const data = noticeItem?.data;
    console.log(noticeItem.type);
    switch (noticeItem?.type) {
      case MT.TOUCH:
        const tFromName = data['user']?.user_name;
        const tAtName = data['at']?.user_name;
        const tTip = data['at']?.user_touchtip;
        setContent(`${tFromName} 摸了摸 ${tAtName} ${tTip}`)
        if (data['at'].user_id == u?.user_id) {
          if (g?.notice) {
            notification.info({ message: "摸一摸", description: `${tFromName} 摸了摸 ${tAtName} ${tTip}` })
          }
          if (g?.sound) {
            noticePlayer.play();
          }
        }
        break;
      case MT.ADD_SONG:
        const fromName = data['user']?.user_name;
        const atName = data['at']?.user_name;
        const songName = data['song']?.name;
        setContent(`${fromName} ${!!atName ? `害羞的为 ${atName} ` : ''}点了一首 ${songName}`);
        // 通知在上一层处理了
        break;
      case MT.PUSH:
        setContent(`${data['user']?.user_name}顶了一下${data['song']?.name}`);
        break;
      case MT.PASS:
        setContent(`呀，${data['content']}`);
        break;
      case MT.SYSTEM:
        setContent(`${data['content']?.replace("@all", "@全体成员")}`)
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
      case MT.REMOVE_SONG:
        const rsName = data['user']?.user_name;
        const rsSong = data['song']?.song?.name;
        setContent(`${rsName} 将歌曲 ${rsSong} 从队列中移除了！`);
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
  loading?: boolean;
  // 通知消息
  type: string;
  timestamp: number;
  data: any;
  id: string;
}
export const MessageList: React.FC = () => {
  const boxRef = useRef<any>();
  const [toTop, setTotop] = useState(false);
  const { msgs } = useCoreModel(model => [model.msgs]);
  const { user } = useUserModel(model => [model.user]);
  useEffect(() => {
    console.log(msgs);
    if (!!!msgs || msgs?.length == 0) return;
    const height = boxRef.current?.scrollHeight;
    if (toTop) return;
    boxRef.current.scrollTop = height + 100000;
  }, [msgs])
  const onScroll = (e: any) => {
    const top = e.target.scrollTop + e.target.clientHeight;
    const height = e.target.scrollHeight;
    if (height - top > 40) {
      if (toTop) return;
      setTotop(true);
    } else {
      if (!toTop) return;
      setTotop(false)
    }
  }
  return (
    <div ref={boxRef} onScroll={debounce(onScroll, 50)} className={classNames("relative flex-grow px-6 py-3 overflow-y-scroll bg-transparent m_scroll overscroll-none", _.msglist)}>
      {toTop ? <div onClick={() => boxRef.current.scrollTo(0, boxRef.current.scrollHeight + 1000)} className="fixed p-2 border cursor-pointer bottom-32 right-3 bg-bg-light" style={{ borderColor: "var(--icon-normal)" }}>回到底部</div> : null}
      {
        msgs?.map((item: IMsgItme, index: number) => {
          let showTime = true;
          if (index >= 1) {
            showTime = (item.message_createtime - (msgs[index - 1].message_createtime)) > 300;
          }
          if (item?.type) {
            return <NoticeMsg key={item?.id} noticeItem={item} showTime={showTime} />
          }
          const isMe = item.message_user == user.user_id;
          if (item.loading) {
            console.log(item);
          }
          return <MsgItem key={item?.message_id} isMe={isMe} msgItem={item} showTime={showTime}></MsgItem>
        })
      }
    </div >
  );
}