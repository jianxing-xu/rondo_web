
import { SideBar } from "components/SideBar";
import { useSocketModel } from "models/socketModel";
import { useUserModel } from "models/userModel";
import React, { ReactElement, useEffect } from "react";
import { classNames } from "utils";
import { Head } from "./Head";
import _ from './index.module.css';
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";


export default function MainWindow(): ReactElement {
  const { user } = useUserModel();
  useEffect(() => {
  }, [user])
  return (
    <>
      <div className={classNames("h-full", _.main_win)}>
        <div className={classNames("flex h-full mx-auto ", _.main_inner)}>
          <SideBar></SideBar>
          <div className={classNames("bg-gray-200 dark:bg-gray-900 bg-opacity-9 0 dark:bg-opacity-80  flex-1 flex flex-col justify-between", _.right_content)}>
            <Head />
            <MessageList />
            <MessageInput onEnter={msg => console.log(msg)} />
          </div>
        </div>
      </div>
    </>
  );
}
