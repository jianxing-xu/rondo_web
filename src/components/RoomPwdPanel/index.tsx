import { HideAllIcon } from "components/HideAllIcon";
import { MInput } from "components/MInput";
import { useCoreModel } from "models/coreModule";
import React from "react";

import _ from "./index.module.css";

export const RightHead = ({
  title = "",
  onSave = () => {},
  loading = false,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-2xl border-b">
      <span>{title}</span>
      <HideAllIcon />
    </div>
  );
};

export const RightPanelWrapper: React.FC = ({ children }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ width: 400 }}
      className="absolute top-0 bottom-0 right-0 h-full p-2 shadow-2xl MyPanel bg-main"
    >
      {children}
    </div>
  );
};
interface IRoomPwdPanel {}
export const RoomPwdPanel: React.FC<IRoomPwdPanel> = ({ children }) => {
  const onJoin = (v: any) => {
    const core = useCoreModel.data;
    core?.changeRoom(core?.pre, v);
    core?.hdieAll();
  };
  return (
    <RightPanelWrapper>
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col h-full">
        <RightHead title={`输入房间${useCoreModel.data?.pre}的密码`} />
        <div className="p-2 pt-4">
          <MInput hint="房间密码" btnTxt="进入" onSearch={onJoin} />
        </div>
      </div>
    </RightPanelWrapper>
  );
};
