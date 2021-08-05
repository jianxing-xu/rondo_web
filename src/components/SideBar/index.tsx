import { useUserModel } from 'models/userModel';
import React from 'react';
import { Form } from 'antd';
import { classNames } from 'utils';
import CST from 'utils/CST';
import _ from "./index.module.css";

import add_song from '../../../assets/addsong.svg';
import queue from '../../../assets/queue.svg';
import room from '../../../assets/room.svg';
import settings from '../../../assets/settings.svg';
import songlist from '../../../assets/songlist.svg';
import { Popover, Switch } from 'antd';
import { useGlobalModel } from 'models/globalModel';


const Btn: React.FC<any> = ({ src, title, ...props }) => {
  return (
    <div className="text-center cursor-pointer select-none" {...props}>
      <img src={src} className="w-5 h-5 mx-auto mb-1 " alt="" />
      <span className="text-xs font-normal text-white active:text-gray-200">{title}</span>
    </div>
  );
}
const SettingMenu: React.FC = () => {
  const { notice, dark, sound, changeSettings } = useGlobalModel();
  return <div className="space-y-4">
    <div>
      <span >消息通知：  </span>
      <Switch defaultChecked={notice == 1} onChange={() => changeSettings("notice")} />
    </div>
    <div>
      <span >声音通知：  </span>
      <Switch defaultChecked={sound == 1} onChange={() => changeSettings("sound")} />
    </div>
    <div>
      <span >深色模式：  </span>
      <Switch defaultChecked={dark == 1} onChange={() => changeSettings("dark")} />
    </div>
  </div>
}
interface ISideBar {
  click: (type: string, e: any) => void;
}
export const SideBar: React.FC<ISideBar> = ({ click = (type: string) => { } }) => {
  const { user } = useUserModel();
  return <>
    <div className="z-10 w-20 bg-sidebar" onClick={e => e.stopPropagation()}>
      <div className={classNames(_.innerBar, "h-full w-14 mx-auto flex flex-col justify-between")}>
        <div className="flex flex-col justify-between flex-grow">
          <div style={{ background: `url('${CST.server_host}/${user?.user_head}') no-repeat center center`, backgroundSize: '100% 100%', backgroundColor: "var(--primary)" }} className={classNames("h-12 w-12 rounded-sm mx-auto mt-6", _.head)}></div>
          <div className={classNames(_.btns, "flex-1 flex flex-col justify-center space-y-6")}>
            <Btn src={add_song} title="点歌" onClick={click.bind(this, "addsong")} />
            <Btn src={queue} title="已点" onClick={click.bind(this, "pointed")} />
            <Btn src={songlist} title="歌单" onClick={(click.bind(this, "songlist"))} />
            <Btn src={room} title="房间 " onClick={(click.bind(this, "rooms"))} />
          </div>
        </div>
        <Popover placement="topRight" content={SettingMenu} title={<span>设置</span>} trigger="click">
          <span className="mt-12 mb-6 justify-self-end"><Btn src={settings} title="设置" /></span>
        </Popover>

      </div>
    </div>
  </>
}