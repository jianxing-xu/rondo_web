import { Button, Form, Input, Select, Modal } from "antd";
import { createRoom } from "api/room";
import { HideAllIcon } from "components/HideAllIcon";
import { useFetch } from "hooks/useFetch";
import { useCoreModel } from "models/coreModule";
import React from "react";

import _ from "./index.module.css";

export const RightHead = ({
  title = "",
  onSave = () => {},
  loading = false,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-2xl border-b text-normal">
      <Button
        loading={loading}
        type="ghost"
        onClick={onSave}
        className="text-normal"
        style={{ color: "var(--font-normal)" }}
      >
        创建
      </Button>
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
interface ICreateRoomPanel {}
export const CreateRoomPanel: React.FC<ICreateRoomPanel> = () => {
  const { loading, fetching } = useFetch(createRoom, {}, { init: false });
  const save = () => form.submit();
  const [form] = Form.useForm();
  const finish = (value: any) => {
    fetching(value).then((res: any) => {
      Modal.confirm({
        title: "创建成功",
        content: `房间创建成功！房间号为:${res?.room_id}，是否立刻进入？`,
        onOk() {
          useCoreModel.data?.changeRoom(res?.room_id);
          useCoreModel.data?.hdieAll();
        },
      });
    });
  };
  return (
    <RightPanelWrapper>
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col h-full">
        <RightHead title="创建房间" onSave={save} loading={loading} />
        <div className="relative flex-grow w-full mt-5 bg-main">
          <Form
            initialValues={{ room_type: 1 }}
            form={form}
            onFinish={finish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17 }}
          >
            <Form.Item
              label="房间名称"
              name="room_name"
              rules={[{ required: true, message: "房间名称？" }]}
            >
              <Input autoComplete="off" placeholder="输入房间名称" />
            </Form.Item>
            <Form.Item
              label="房间公告"
              name="room_notice"
              rules={[{ required: true, message: "房间公告？" }]}
            >
              <Input autoComplete="off" placeholder="输入房间公告" />
            </Form.Item>
            <Form.Item
              label="房间类型"
              name="room_type"
              rules={[{ required: true, message: "房间类型？" }]}
            >
              <Select>
                <Select.Option value={1}>音乐点歌房</Select.Option>
                <Select.Option value={4}>房主电台房</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>
    </RightPanelWrapper>
  );
};
