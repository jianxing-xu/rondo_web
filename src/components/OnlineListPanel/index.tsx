import { Popover, Spin } from "antd";
import { mo } from "api/message";
import { online } from "api/user";
import SvgIcon from "components/SvgIcon";
import { useFetch } from "hooks/useFetch";
import { useCoreModel } from "models/coreModule";
import { AvatarMenu } from "pages/MainWindow/MessageList";
import React, { useEffect } from "react";
import CST from "utils/CST";

import _ from "./index.module.css";

export const RightHead = ({ title = "" }) => {
  return <div className="py-3 text-2xl">{title}</div>;
};

export const RightPanelWrapper: React.FC = ({ children }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ width: 400 }}
      className="absolute top-0 bottom-0 right-0 h-full p-2 shadow-2xl bg-main"
    >
      {children}
    </div>
  );
};
interface IOnlineListPanel {}
export const OnlineListPanel: React.FC<IOnlineListPanel> = () => {
  const { data, loading, fetching } = useFetch(online, {}, { init: false });
  useEffect(() => {
    fetching({ roomId: useCoreModel?.data?.roomId });
  }, []);
  const touch = (user: any, e: any) => {
    if (!e.target.classList.contains("head_bounce")) {
      e.target.classList.add("head_bounce");
    }
    mo({ room_id: useCoreModel?.data?.roomId, at: user?.user_id }).catch(
      (e) => {}
    );
  };
  return (
    <RightPanelWrapper>
      <RightHead title="在线用户" />
      <div
        className="absolute bottom-0 left-0 right-0 overflow-y-auto m_scroll"
        style={{ top: 70 }}
      >
        <Spin spinning={loading}>
          {loading && !data?.length ? <div className="py-40"></div> : null}
          {data?.map((item: any, index: number) => (
            // 单个
            <div
              key={item?.user_id}
              className="relative flex flex-1 px-2 py-2 m-2 transition rounded hover:bg-select"
            >
              <Popover
                destroyTooltipOnHide
                color="var(--bg-light)"
                content={<AvatarMenu user={item} />}
              >
                <img
                  onDoubleClick={(e) => touch(item, e)}
                  className="w-12 h-12 rounded"
                  src={CST.static_url + item?.user_head}
                  alt=""
                />
              </Popover>
              <div className="w-4/5 pl-2 truncate">
                <div className="truncate">{item?.user_name}</div>
                <div className="flex items-center pt-2 truncate text-md text-light">
                  <span
                    className="inline-block mr-1"
                    style={{
                      color: item.user_sex == 0 ? "var(--boy)" : "var(--girl)",
                    }}
                  >
                    <SvgIcon name={item.user_sex == 0 ? "boy" : "girl"} />
                  </span>
                  <span className="truncate">{item?.user_remark}</span>
                </div>
              </div>
            </div>
          ))}
        </Spin>
      </div>
    </RightPanelWrapper>
  );
};
