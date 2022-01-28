import React from "react";
import { classNames } from "utils";
import CST, { POPKEY } from "utils/CST";
import _ from "./index.module.css";

import add_song from "../../../assets/addsong.svg";
import queue from "../../../assets/queue.svg";
import room from "../../../assets/room.svg";
import settings from "../../../assets/settings.svg";
import songlist from "../../../assets/songlist.svg";
import message from "../../../assets/message.svg";
import { Popover, Switch } from "antd";
import { useGlobalModel } from "models/globalModel";
import { useCoreModel } from "models/coreModule";
import { useHistory } from "react-router-dom";

// 菜单按钮组件
export const Btn: React.FC<any> = ({ src, title, ...props }) => {
  return (
    <div
      className="flex flex-col text-center cursor-pointer select-none"
      {...props}
    >
      <img src={src} className="w-5 h-5 mx-auto mb-1 " alt="" />
      <span className="text-xs font-normal text-sidebar active:text-light2">
        {title}
      </span>
    </div>
  );
};
// 设置菜单Popup组件
export const SettingMenu: React.FC = () => {
  const { notice, dark, sound, changeSettings } = useGlobalModel((model) => [
    model.notice,
    model.dark,
    model.sound,
  ]);
  return (
    <div className="space-y-4">
      <div>
        <span>消息通知： </span>
        <Switch
          defaultChecked={notice == 1}
          onChange={() => changeSettings("notice")}
        />
      </div>
      <div>
        <span>声音通知： </span>
        <Switch
          defaultChecked={sound == 1}
          onChange={() => changeSettings("sound")}
        />
      </div>
      <div>
        <span>深色模式： </span>
        <Switch
          defaultChecked={dark == 1}
          onChange={() => changeSettings("dark")}
        />
      </div>
    </div>
  );
};
interface ISideBar {
  click: (type: string, e: any) => void;
}
// 菜单选项
export const menu = [
  {
    icon: message,
    label: "消息",
    value: "message",
  },
  {
    icon: add_song,
    label: "点歌",
    value: "addsong",
  },
  {
    icon: queue,
    label: "已点",
    value: "pointed",
  },
  {
    icon: songlist,
    label: "歌单",
    value: "songlist",
  },
  {
    icon: room,
    label: "房间",
    value: "rooms",
  },
];
export const SideBar: React.FC<ISideBar> = ({
  click = (type: string) => {},
}) => {
  const { user, showDialog } = useCoreModel((m) => [m.user]);
  const history = useHistory();
  const handleShow = () => {
    if (user.user_id == -1) {
      history.push("/login");
    } else {
      showDialog(POPKEY.PROFILE_ME);
    }
  };
  return (
    <>
      <div
        className={classNames("z-10 w-20 bg-sidebar ", _.bg_sidebar)}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={classNames(
            _.innerBar,
            "h-full w-14 mx-auto flex flex-col justify-between"
          )}
        >
          {/* 头像 */}
          <div
            onClick={handleShow}
            style={{
              backgroundImage: `url('${CST.static_url}/${user?.user_head}')`,
              borderRadius: "50%",
            }}
            className={classNames(
              "h-12 w-12 rounded-full mx-auto mt-6 cursor-pointer",
              _.head
            )}
          ></div>
          {/* 菜单 */}
          <div
            className={classNames(
              _.btns,
              "flex-1 flex flex-col justify-center space-y-6"
            )}
          >
            {menu.map((item) => (
              <Btn
                key={item.label}
                src={item.icon}
                title={item.label}
                onClick={click.bind(this, item.value)}
              />
            ))}
          </div>
          {/* 设置 */}
          <Popover
            placement="topRight"
            content={SettingMenu}
            title={<span>设置</span>}
            trigger="click"
          >
            <span className="mt-12 mb-6 justify-self-end">
              <Btn src={settings} title="设置" />
            </span>
          </Popover>
        </div>
      </div>
    </>
  );
};
