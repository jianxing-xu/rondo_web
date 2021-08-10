import { Button, Form, Input, message, Select, Spin, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { createRoom } from 'api/room';
import { myInfo, updateUser } from 'api/user';
import { useFetch } from 'components/AddSongPanel';
import { useCoreModel } from 'models/coreModule';
import { useUserModel } from 'models/userModel';
import React, { useEffect } from 'react';
import CST from 'utils/CST';

import _ from './index.module.css';

export const RightHead = ({ title = "", onSave = () => { }, loading = false }) => {
  return (
    <div className="flex justify-between px-4 py-3 text-2xl border-b">
      <span>{title}</span>
      <Button loading={loading} type="default" onClick={onSave}>创建</Button>
    </div>
  );
}


export const RightPanelWrapper: React.FC = ({ children }) => {
  return <div onClick={(e) => e.stopPropagation()} style={{ width: 400 }} className="absolute top-0 bottom-0 right-0 h-full p-2 shadow-2xl bg-bgc">
    {children}
  </div>
}
interface ICreateRoomPanel {

}
export const CreateRoomPanel: React.FC<ICreateRoomPanel> = () => {
  const [form] = useForm();
  const { loading, fetching } = useFetch(createRoom, {}, { init: false });
  const save = () => form.submit();
  const finish = (value: any) => {
    fetching(value).then((res: any) => {
      Modal.confirm({
        title: "创建成功",
        content: `房间创建成功！房间号为:${res?.room_id}，是否立刻进入？`,
        onOk() {
          useCoreModel.data?.changeRoom(res?.room_id);
        }
      });
    })
  }
  useEffect(() => {

  }, [])
  console.log("RENDER_PROFILE_ME");
  return <RightPanelWrapper>
    <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col h-full">
      <RightHead title="创建房间" onSave={save} loading={loading} />
      <div className="relative flex-grow w-full mt-5 bg-bgc" >
        <Form initialValues={{ room_type: 1 }} form={form} onFinish={finish} labelCol={{ span: 6 }} wrapperCol={{ span: 17 }}>
          <Form.Item
            label="房间名称"
            name="room_name"
            rules={[{ required: true, message: '房间名称？' }]}
          >
            <Input autoComplete="off" placeholder="输入房间名称" />
          </Form.Item>
          <Form.Item
            label="房间公告"
            name="room_notice"
            rules={[{ required: true, message: '房间公告？' }]}>
            <Input autoComplete="off" placeholder="输入房间公告" />
          </Form.Item>
          <Form.Item
            label="房间类型"
            name="room_type"
            rules={[{ required: true, message: '房间类型？' }]}>
            <Select>
              <Select.Option value={0}>文字聊天房</Select.Option>
              <Select.Option value={1}>音乐点歌房</Select.Option>
              <Select.Option value={4}>房主电台房</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className="flex justify-end w-full bg-bgc" style={{ height: "8%" }}>

      </div>
    </div>
  </RightPanelWrapper>
}