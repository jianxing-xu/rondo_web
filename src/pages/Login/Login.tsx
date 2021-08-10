

import { Button, Form, Input, message } from 'antd';
import React, { ReactElement, useEffect, useState } from "react";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { classNames, getOsInfo } from "utils";
import style from "./Login.module.css";
import { useForm } from 'antd/lib/form/Form';
import { login } from 'api/user';
import { useUserModel } from 'models/userModel';
import { sendMail } from 'api/common';
import CST from 'utils/CST';
import { useGlobalModel } from 'models/globalModel';
import { useCoreModel } from 'models/coreModule';




export default function Login(): ReactElement {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { user } = useUserModel(model => [model.user]);
  const { reconnect } = useCoreModel(model => []);
  const [form] = useForm();

  useEffect(() => {
    console.log(user);
    if (user?.user_id !== CST.guestUserInfo.user_id) {
      history.replace("/");
    }
  }, []);


  const finish = (values: any) => {
    setLoading(true);
    values["plat"] = getOsInfo()["name"];
    login({ ...values }).then(async res => {
      reconnect();
      history.replace("/");
    }).finally(() => setLoading(false));
  }
  const sendMailHandle = () => {
    setLoading(true);
    form.validateFields(["account"]).then(async (values) => {
      await sendMail(values["account"]);
      message.success("邮件发送成功");
    }).finally(() => setLoading(false));
  }
  const handleVisitor = () => {
    history.replace("/");
    useCoreModel.data?.reconnect();
  }
  return (
    <>
      <div className="flex items-center justify-center w-full h-full login">
        <div className={classNames("bg-gray-200 dark:bg-gray-700 w-3/5 rounded-lg p-8 divide-gray-700", style?.login_panel)}>
          <div className="flex items-center justify-between divide-x-2 divide-gray-400 login_panel_head">
            <h2 className="text-3xl font-semibold text-current">先登录后在一起玩耍</h2>
            <a onClick={handleVisitor} className="pl-8 text-lg text-gray-400 cursor-pointer select-none hover:text-gray-500">游客登录</a>
          </div>
          <div className="pt-8 login_panel_form">
            <Form form={form} onFinish={finish}>
              <Form.Item
                name="account"
                rules={[{ required: true, message: "你是谁？" }]}
              >
                <Input addonAfter={<Button loading={loading} type="link" className="cursor-pointer" onClick={sendMailHandle}>发送邮件</Button>} size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账户/邮箱/ID" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "啊这..." }]}
              >
                <Input
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="密码/邮箱验证码"
                />
              </Form.Item>
              <Form.Item>
                <Button loading={loading} style={{ width: "100px" }} size="large" type="primary" htmlType="submit" className="login-form-button">
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
