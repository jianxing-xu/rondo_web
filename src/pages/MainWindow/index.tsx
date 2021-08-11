
import { Drawer, message, Spin } from "antd";
import MPopover from "components/MPopover";
import { AddSongPanel } from "components/AddSongPanel";
import { SideBar } from "components/SideBar";
import { initModel, useCoreModel } from "models/coreModule";
import { useSocketModel } from "models/socketModel";
import { useUserModel } from "models/userModel";
import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { classNames } from "utils";
import CST, { POPKEY } from "utils/CST";
import { Head } from "./Head";
import _ from './index.module.css';
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { WaitQueuePanel } from "components/WaitQueuePanel";
import { MySongsPanel } from "components/MySongsPanel";
import { RoomListPanel } from "components/RoomListPanel";
import { ProfilePanel } from "components/Profile";
import { OnlineListPanel } from "components/OnlineListPanel";
import { ProfileMePanel } from "components/ProfileMePanel";
import { CreateRoomPanel } from "components/CreateRoomPanel";
import { RoomSettingPanel } from "components/RoomSettingPanel";
import { RoomPwdPanel } from "components/RoomPwdPanel";


export default function MainWindow(): ReactElement {
  const { dialog, showDialog, hdieAll } = useCoreModel(model => [model.dialog]); // MainWindow 依赖CoreModel
  const { room } = useSocketModel(model => [model.room]);

  const siderClick = useCallback((type: string) => {
    switch (type) {
      case "addsong":
        showDialog(POPKEY.SEARCH);
        break;
      case "pointed":
        showDialog(POPKEY.WAIT_QUEUE);
        break;
      case "songlist":
        showDialog(POPKEY.MY_SONGS);
        break;
      case "rooms":
        showDialog(POPKEY.ROOM_LIST)
        break;
      default: break;
    }
  }, [])

  console.log("MAIN WINDOW RENDER");
  return (
    <>
      <div className={classNames("h-full", _.main_win)} onClick={hdieAll}>
        <div className={classNames("flex h-full mx-auto ", _.main_inner)} style={{ backgroundImage: `url(${CST.static_url + room?.room?.room_background || "public/bg.jpg"})` }}>
          <SideBar click={siderClick} /> {/** Head组件初始化userModel */}
          <div className={classNames("relative bg-gray-200 dark:bg-sidebar dark:bg-opacity-95 bg-opacity-95 flex-1 flex flex-col justify-between", _.right_content)}>
            <Head /> {/** Head组件初始化socketModel */}
            <MessageList />
            <MessageInput />
            {dialog.SEARCH ? <AddSongPanel /> : null}
            {dialog.WAIT_QUEUE ? <WaitQueuePanel /> : null}
            {dialog.MY_SONGS ? <MySongsPanel /> : null}
            {dialog.ROOM_LIST ? <RoomListPanel /> : null}
            {dialog.PROFILE ? <ProfilePanel /> : null}
            {dialog.ONLINE_LIST ? <OnlineListPanel /> : null}
            {dialog.PROFILE_ME ? <ProfileMePanel /> : null}
            {dialog.ROOM_CREATE ? <CreateRoomPanel /> : null}
            {dialog.ROOM_SETTING ? <RoomSettingPanel /> : null}
            {dialog.ROOM_PWD ? <RoomPwdPanel /> : null}
          </div>
        </div>
      </div>
    </>
  );
}
