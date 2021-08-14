import { Form, Input, message, Modal, Tooltip } from "antd";
import FormItem from "antd/lib/form/FormItem";
import TextArea from "antd/lib/input/TextArea";
import { sendBugs } from "api/common";
import SvgIcon from "components/SvgIcon";
import { useCoreModel } from "models/coreModule";
import React, { useMemo } from "react";
import { useState } from "react";
import { POPKEY } from "utils/CST";
import _ from "./index.module.css";

export const Head: React.FC = () => {
  const [bs, setBs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { room, now, user, showDialog } = useCoreModel((m) => [
    m.room,
    m.room,
    m.now,
  ]);
  const isMeRoom = useMemo(() => {
    return user?.user_id === room?.room_user || user?.admin;
  }, [user, room]);
  const sendBugsHandle = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      sendBugs({ ...values })
        .then(() => {
          message.success("提交成功，感谢反馈！");
        })
        .finally(() => {
          setLoading(false);
          setBs(false);
        });
    });
  };
  return (
    <div
      className="flex items-center justify-between px-4 py-2 text-lg border-b border-gray-300 dark:border-gray-600"
      style={{ backgroundColor: "transparent" }}
    >
      <Tooltip title="房间ID(房间号)">
        <span
          className="px-1 text-sm font-bold border border-red-500 rounded-sm tag"
          style={{ color: "var(--primary)" }}
        >
          ID:{room?.room_id}
        </span>
      </Tooltip>
      <span
        onClick={() => showDialog(POPKEY.ROOM_SETTING)}
        className="absolute flex items-center text-sm cursor-pointer select-none left-24"
      >
        {isMeRoom ? (
          <>
            <SvgIcon name="xingzhuang604" className="text-sm" />
            <span style={{ paddingLeft: 2 }}> 管理</span>
          </>
        ) : null}
      </span>
      <span className="flex items-center room_name">
        <Tooltip title="房间类型">
          <svg
            className="text-xl icon"
            style={{ color: "var(--primary)" }}
            aria-hidden="true"
          >
            <use xlinkHref="#icon-erji"></use>
          </svg>
        </Tooltip>
        <span className="text-sm font-bold">
          {room?.room_name}(
          <Tooltip title="在线人数">
            <span
              onClick={() => showDialog(POPKEY.ONLINE_LIST)}
              style={{ color: "var(--primary)" }}
              className="cursor-pointer"
            >
              <span className="text-current">
                {(now?.onlineCount || 0) + 2}
              </span>
              <svg className="inline icon" aria-hidden="true">
                <use xlinkHref="#icon-PersonalCenteron"></use>
              </svg>
            </span>
          </Tooltip>
          )
        </span>
      </span>
      <span
        onClick={() => setBs(true)}
        className="flex items-center text-sm cursor-pointer"
      >
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-bug"></use>
        </svg>
        <span className="pl-1">bug反馈</span>
      </span>
      <Modal
        confirmLoading={loading}
        okText="提交"
        cancelText="取消"
        className={_.modal}
        title="反馈建议"
        visible={bs}
        onOk={sendBugsHandle}
        onCancel={() => setBs(false)}
      >
        <Form form={form}>
          <FormItem
            name="content"
            rules={[
              { required: true, message: "不能为空" },
              { min: 15, message: "最低15个字符" },
            ]}
          >
            <TextArea placeholder="意见建议，bug反馈" />
          </FormItem>
          <FormItem
            name="contact"
            rules={[{ required: true, message: "不能为空" }]}
          >
            <Input placeholder="联系方式,本站不会保存此信息" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};
