import { Button, Form, Input, message } from "antd";
import { editUserUsingPost } from "@/api/userController";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores";
import { setLoginUser } from "@/stores/loginUser";

interface Props {
  user: API.LoginUserVO;
}

/**
 * 用户信息编辑表单
 * @constructor
 */
const UserInfoEditForm = (props: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch<AppDispatch>();

  const [form] = Form.useForm();
  const { user } = props;
  form.setFieldsValue(user);

  /**
   * 提交
   *
   * @param values
   */
  const doSubmit = async (values: API.UserEditRequest) => {
    const hide = messageApi.loading("正在操作");
    try {
      await editUserUsingPost(values);
      hide();
      messageApi.success("操作成功");
      dispatch(setLoginUser({ ...user, ...values }));
    } catch (e) {
      hide();
      messageApi.error("操作失败，" + (e as Error).message);
    }
  };

  return (
    <div className="user-info-edit-form">
      {contextHolder}
      <Form
        form={form}
        style={{ marginTop: 15, maxWidth: 480 }}
        labelCol={{ span: 4 }}
        labelAlign="left"
        onFinish={doSubmit}
      >
        <Form.Item
            label="头像"
            name="userAvatar"
            style={{ background: "rgba(255,255,255,0)" }}
        >
          <Input
              placeholder="头像链接：url地址"
              style={{ background: "rgba(255,255,255,0.5)" }}
          />
        </Form.Item>
        <Form.Item
          label="手机号"
          name="phoneNumber"
          style={{ background: "rgba(255,255,255,0)" }}
        >
          <Input
            placeholder="请输入手机号"
            style={{ background: "rgba(255,255,255,0.5)" }}
          />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          style={{ background: "rgba(255,255,255,0)" }}
        >
          <Input
            placeholder="请输入邮箱"
            style={{ background: "rgba(255,255,255,0.5)" }}
          />
        </Form.Item>
        <Form.Item
          label="年级"
          name="grade"
          style={{ background: "rgba(255,255,255,0)" }}
        >
          <Input
            placeholder="请输入年级"
            style={{ background: "rgba(255,255,255,0.5)" }}
          />
        </Form.Item>
        <Form.Item
          label="工作经验"
          name="workExperience"
          style={{ background: "rgba(255,255,255,0)" }}
        >
          <Input
            placeholder="请输入工作经验"
            style={{ background: "rgba(255,255,255,0.5)" }}
          />
        </Form.Item>
        <Form.Item
          label="擅长方向"
          name="expertiseDirection"
          style={{ background: "rgba(255,255,255,0)" }}
        >
          <Input
            placeholder="请输入擅长方向"
            style={{ background: "rgba(255,255,255,0.5)" }}
          />
        </Form.Item>
        <Form.Item>
          <Button style={{ width: 150 }} type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserInfoEditForm;
