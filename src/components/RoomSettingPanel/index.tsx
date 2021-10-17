import { Button, Form, Input, message, Select, Upload } from "antd";
import { updateRoom } from "api/room";
import { HideAllIcon } from "components/HideAllIcon";
import { useFetch } from "hooks/useFetch";

import { useCoreModel } from "models/coreModule";
import React, { useEffect, useState } from "react";
import { handleUpload } from "utils";

import _ from "./index.module.css";

export const RightHead = ({
  title = "",
  onSave = () => {},
  loading = false,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-2xl border-b">
      <span>{title}</span>
      <Button
        ghost
        loading={loading}
        type="default"
        onClick={onSave}
        style={{ color: "var(--font-normal)" }}
      >
        保存
      </Button>
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
interface IRoomSettingPanel {}
export const RoomSettingPanel: React.FC<IRoomSettingPanel> = () => {
  const [fields, setFields] = useState({
    rputlic: false,
    dtmode: false,
  });
  const [form] = Form.useForm();
  const { loading, fetching } = useFetch(updateRoom, {}, { init: false });
  const save = () => form.submit();
  const finish = (value: any) => {
    const s = useCoreModel.data;
    fetching({ ...value, room_id: s?.roomId }).then((res: any) => {
      message.success("保存成功！");
      s?.fetchRoomInfo(s?.roomId);
    });
  };
  useEffect(() => {
    const s = useCoreModel.data;
    setFields({
      rputlic: s?.room?.room_public === 0,
      dtmode: s?.room?.room_type === 4,
    });
  }, []);
  return (
    <RightPanelWrapper>
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col h-full">
        <RightHead title="房间设置" onSave={save} loading={loading} />
        <div className="relative flex-grow w-full mt-5 bg-main">
          <div className="absolute top-0 bottom-0 left-0 right-0 overflow-y-scroll m_scroll">
            <Form
              initialValues={{ ...useCoreModel.data?.room }}
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
                <Select
                  onChange={(v) =>
                    setFields((val) => ({ ...val, dtmode: v == 4 }))
                  }
                >
                  <Select.Option value={0}>文字聊天房</Select.Option>
                  <Select.Option value={1}>音乐点歌房</Select.Option>
                  <Select.Option value={4}>房主电台房</Select.Option>
                </Select>
              </Form.Item>
              {fields.dtmode ? (
                <Form.Item
                  label="循环方式"
                  name="room_playone"
                  rules={[{ required: true, message: "房间类型？" }]}
                >
                  <Select>
                    <Select.Option value={0}>随机播放</Select.Option>
                    <Select.Option value={1}>单曲循环</Select.Option>
                  </Select>
                </Form.Item>
              ) : null}
              <Form.Item
                label="隐藏房间"
                name="room_hide"
                rules={[{ required: true, message: "隐藏房间？" }]}
              >
                <Select>
                  <Select.Option value={0}>在房间列表显示</Select.Option>
                  <Select.Option value={1}>在房间列表隐藏</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="房间权限"
                name="room_public"
                rules={[{ required: true, message: "房间权限？" }]}
              >
                <Select
                  onChange={(v) =>
                    setFields((val) => ({ ...val, rputlic: v == 0 }))
                  }
                >
                  <Select.Option value={0}>公开房间</Select.Option>
                  <Select.Option value={1}>加密房间</Select.Option>
                </Select>
              </Form.Item>
              {!fields.rputlic ? (
                <Form.Item label="房间密码" name="room_password">
                  <Input autoComplete="off" placeholder="输入房间密码" />
                </Form.Item>
              ) : null}
              <Form.Item label="房间背景" name="room_background">
                <Input
                  disabled
                  autoComplete="off"
                  placeholder="房间背景地址"
                  addonAfter={
                    <Upload
                      showUploadList={false}
                      customRequest={(e) =>
                        handleUpload(e, "1", (res: any) =>
                          form.setFieldsValue({
                            room_background: res.attach_path,
                          })
                        )
                      }
                    >
                      <div className="text-normal">选择</div>
                    </Upload>
                  }
                />
              </Form.Item>
              <Form.Item label="全员禁言" name="room_sendmsg">
                <Select>
                  <Select.Option value={0}>所有人可发言</Select.Option>
                  <Select.Option value={1}>管理员房主可发言</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="机器点歌" name="room_robot">
                <Select>
                  <Select.Option value={1}>开启机器人点歌</Select.Option>
                  <Select.Option value={0}>关闭机器人点歌</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="点歌间隔" name="room_addsongcd">
                <Input
                  type="number"
                  max={60}
                  min={3}
                  placeholder="最大60，最小3"
                />
              </Form.Item>
              <Form.Item label="顶歌间隔" name="room_pushsongcd">
                <Input
                  type="number"
                  max={60}
                  min={3}
                  placeholder="最大60，最小3"
                />
              </Form.Item>
              <Form.Item label="日顶次数" name="room_pushdaycount">
                <Input
                  type="number"
                  max={10}
                  min={3}
                  placeholder="最大10，最小1"
                />
              </Form.Item>
              <Form.Item label="点歌限额" name="room_addcount">
                <Input
                  type="number"
                  max={10}
                  min={3}
                  placeholder="最大10，最小1"
                />
              </Form.Item>
              <Form.Item label="投票切歌" name="room_votepass">
                <Select>
                  <Select.Option value={1}>开启投票切歌</Select.Option>
                  <Select.Option value={0}>关闭投票切歌</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="投票比例" name="room_votepercent">
                <Select>
                  <Select.Option value={20}>20%</Select.Option>
                  <Select.Option value={30}>30%</Select.Option>
                  <Select.Option value={40}>40%</Select.Option>
                  <Select.Option value={50}>50%</Select.Option>
                  <Select.Option value={60}>60%</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="开启点歌" name="room_addsong">
                <Select>
                  <Select.Option value={0}>所有人可点</Select.Option>
                  <Select.Option value={1}>仅房主可点</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div
          className="flex justify-end w-full pt-1 pr-4 bg-main"
          style={{ height: "8%" }}
        >
          <Button
            className="rounded"
            ghost
            style={{ color: "var(--font-normal)" }}
          >
            清理聊天记录
          </Button>
        </div>
      </div>
    </RightPanelWrapper>
  );
};
