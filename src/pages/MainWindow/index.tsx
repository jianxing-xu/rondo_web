
import { Drawer } from "antd";
import MPopover from "components/MPopover";
import { AddSongPanel } from "components/AddSongPanel";
import { SideBar } from "components/SideBar";
import { useCoreModel } from "models/coreModule";
import { useSocketModel } from "models/socketModel";
import { useUserModel } from "models/userModel";
import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { classNames } from "utils";
import { POPKEY } from "utils/CST";
import { Head } from "./Head";
import _ from './index.module.css';
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { WaitQueuePanel } from "components/WaitQueuePanel";
import { MySongsPanel } from "components/MySongsPanel";


export default function MainWindow(): ReactElement {
  const { dialog, showDialog, hdieAll } = useCoreModel();
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
      case "rooms": break;
      default: break;
    }
  }, [])

  return (
    <>
      <div className={classNames("h-full", _.main_win)} onClick={hdieAll}>
        <div className={classNames("flex h-full mx-auto ", _.main_inner)}>
          <SideBar click={siderClick} />
          <div className={classNames("relative bg-gray-200 dark:bg-bgc bg-opacity-80 0 dark:bg-opacity-80  flex-1 flex flex-col justify-between", _.right_content)}>
            <Head />
            <MessageList />
            <MessageInput onEnter={msg => console.log(msg)} />
            {dialog.SEARCH ? <AddSongPanel /> : null}
            {dialog.WAIT_QUEUE ? <WaitQueuePanel /> : null}
            {dialog.MY_SONGS ? <MySongsPanel /> : null}
          </div>
        </div>
      </div>
    </>
  );
}
