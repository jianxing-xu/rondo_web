
import { MInput } from 'components/MInput';
import { useCoreModel } from 'models/coreModule';
import React from 'react';

import _ from './index.module.css';

export const RightHead = ({ title = "", onSave = () => { }, loading = false }) => {
  return (
    <div className="flex justify-between px-4 py-3 text-2xl border-b">
      <span>{title}</span>
    </div>
  );
}


export const RightPanelWrapper: React.FC = ({ children }) => {
  return <div onClick={(e) => e.stopPropagation()} style={{ width: 400 }} className="absolute top-0 bottom-0 right-0 h-full p-2 shadow-2xl bg-bgc">
    {children}
  </div>
}
interface IRoomPwdPanel {

}
export const RoomPwdPanel: React.FC<IRoomPwdPanel> = ({ children }) => {
  const { changeRoom, pre, hdieAll } = useCoreModel(model => [])
  const onJoin = (v: any) => {
    changeRoom(pre, v);
    hdieAll();
  }
  console.log("RENDER_PROFILE_ME");
  return <RightPanelWrapper>
    <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col h-full">
      <RightHead title={`输入房间${pre}的密码`} />
      <div className="p-2 pt-4">
        <MInput hint="房间密码" btnTxt="进入" onSearch={onJoin} />
      </div>
    </div>
  </RightPanelWrapper>
}