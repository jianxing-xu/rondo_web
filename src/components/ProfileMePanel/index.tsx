import { Button, Form, Input, message, Radio, Select, Spin, Upload } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { uploadImg } from 'api/attach';
import { updateUser } from 'api/user';
import { useFetch } from 'hooks/useFetch';
import { useUserModel } from 'models/userModel';
import React, { useEffect } from 'react';
import CST from 'utils/CST';

import _ from './index.module.css';

export const RightHead = ({ title = "", onSave = () => { }, loading = false }) => {
  return (
    <div className="flex justify-between px-4 py-3 text-2xl border-b">
      <span>{title}</span>
      <Button loading={loading} type="default" onClick={onSave}>保存</Button>
    </div>
  );
}


export const RightPanelWrapper: React.FC = ({ children }) => {
  return <div onClick={(e) => e.stopPropagation()} style={{ width: 400 }} className="absolute top-0 bottom-0 right-0 h-full p-2 shadow-2xl bg-bgc">
    {children}
  </div>
}
interface IProfileMePanel {

}
export const ProfileMePanel: React.FC<IProfileMePanel> = ({ children }) => {
  const { user, setUser, logout } = useUserModel(model => [model.user])
  const [form] = useForm();
  const { loading: Uloading, fetching: UFetching } = useFetch(updateUser, {}, { init: false });
  const { loading: Aloading, data: Adata, fetching: AFetching } = useFetch(uploadImg, {}, { init: false });
  const save = () => form.submit();
  const finish = (value: any) => {
    UFetching(value).then(() => {
      setUser((user) => ({ ...user, ...value }));
      message.success("保存成功");
    })
  }
  const handleUpload = (e: any) => {
    if (["image/jpg", "image/png", "image/gif"].includes(e?.file?.type)) {
      AFetching({ file: e.file, type: 0 }).then((res: any) => {
        form.setFieldsValue({ "user_head": res.attach_path });
      })
    }
  }
  useEffect(() => {

  }, [])
  console.log("RENDER_PROFILE_ME");
  return <RightPanelWrapper>
    <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col h-full">
      <RightHead title="我的信息" onSave={save} loading={Uloading} />
      <div className="space-y-2 text-center py-7">
        <Upload name="avatar" showUploadList={false} customRequest={handleUpload}>
          <Spin spinning={Aloading}>
            <img className="w-16 h-16 mx-auto rounded-md" src={CST.static_url + (Adata?.attach_path || user?.user_head)} alt="" />
          </Spin>
        </Upload>
        <div>ID: <span className="text-primary">{user?.user_id}</span></div>
      </div>
      <div className="relative flex-grow w-full bg-bgc" >
        <Form form={form} initialValues={user} onFinish={finish} labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
          <Form.Item hidden name="user_head">
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="昵称"
            name="user_name"
            rules={[{ required: true, message: '你是谁？' }]}
          >
            <Input autoComplete="off" placeholder="输入你的昵称" />
          </Form.Item>
          <Form.Item
            label="签名"
            name="user_remark">
            <Input autoComplete="off" placeholder="输入你的签名" />
          </Form.Item>
          <Form.Item
            label="摸摸"
            name="user_touchtip">
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="性别"
            name="user_sex">
            <Radio.Group >
              <Radio value={0}>男生</Radio>
              <Radio value={1}>女生</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="密码"
            name="user_password">
            <Input autoComplete="off" placeholder="不修改请留空" />
          </Form.Item>
        </Form>
      </div>
      <div className="flex justify-end w-full bg-bgc" style={{ height: "8%" }}>
        <Button danger className="self-center" onClick={logout}>退出登录</Button>
      </div>
    </div>
  </RightPanelWrapper>
}