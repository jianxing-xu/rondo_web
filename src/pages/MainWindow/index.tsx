import { AddSongPanel } from "components/AddSongPanel";
import { SideBar } from "components/SideBar";
import { useCoreModel } from "models/coreModule";
import React, { ReactElement, useCallback, useEffect } from "react";
import { classNames } from "utils";
import CST, { POPKEY } from "utils/CST";
import { Head } from "./Head";
import _ from "./index.module.css";
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
import { useGlobalModel } from "models/globalModel";

export default function MainWindow(): ReactElement {
  const { dark } = useGlobalModel((m) => [m.dark]);
  const { dialog, showDialog, hdieAll, room } = useCoreModel((model) => [
    model.dialog,
    model.room,
  ]); // MainWindow 依赖CoreModel

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
        showDialog(POPKEY.ROOM_LIST);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    console.log(dialog);
  }, [dialog]);

  return (
    <>
      <div
        className={classNames("h-full", _.main_win)}
        onClick={hdieAll}
        style={{
          backgroundImage: `url(${
            room?.room_background
              ? CST.static_url + room?.room_background
              : `/public/bg_${dark === 1 ? "dark" : "light"}.jpg`
          })`,
        }}
      >
        <div className={classNames("flex h-full mx-auto ", _.main_inner)}>
          <SideBar click={siderClick} /> {/** Head组件初始化userModel */}
          <div
            className={classNames(
              "relative flex-1 flex flex-col justify-between bg-opa-80",
              _.right_content
            )}
          >
            <div
              style={{ height: "5%" }}
              className="flex border-b border-gray-300 dark:border-gray-600"
            >
              <Head /> {/** Head组件初始化socketModel */}
            </div>
            <div className="" style={{ height: "75%" }}>
              <MessageList />
            </div>
            <div style={{ height: "20%" }}>
              <MessageInput />
            </div>
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
