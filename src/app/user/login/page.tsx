"use client";
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from "@ant-design/icons";
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { message, Space, Tabs } from "antd";
import React, {CSSProperties, useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {getLoginUserUsingGet, userLoginUsingPost} from "@/api/userController";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores";
import { setLoginUser } from "@/stores/loginUser";
import { ProForm } from "@ant-design/pro-form/lib";
import "./index.css";
import { useRouter } from "next/navigation";

type LoginType = "phone" | "account";
/**
 * 用户登录页面
 * @constructor
 */
const UserLoginPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loginType, setLoginType] = useState<LoginType>("account");
  const items = [
    { label: "账户密码登录", key: "account" },
    { label: "验证码登录", key: "phone" },
  ];
  const [form] = ProForm.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  /**
   * 提交
   */
  const onFinish = async (values: API.UserLoginRequest) => {
    try {
      const res = await userLoginUsingPost(values);
      if (res.data) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        dispatch(setLoginUser(res.data));
        router.replace("/");
        form.resetFields();
      }
    } catch (e) {
      messageApi.error( "登录失败：" + (e as Error).message);
    }
  };

  const iconStyles: CSSProperties = {
    marginInlineStart: "16px",
    color: "rgba(0, 0, 0, 0.2)",
    fontSize: "24px",
    verticalAlign: "middle",
    cursor: "pointer",
  };

  // 判断是否登录，已登录用户直接跳转首页
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await getLoginUserUsingGet();
        if (res.code === 0 && res.data) {
          router.replace('/');
        }
      } catch (error) {
        console.error('Failed to get login user:', error);
      }
    };

    checkLoginStatus();
  }, []); // 空依赖数组确保只在组件挂载时执行一次

  return (
    <div id="user-login-page">
      {contextHolder}
      <LoginForm
        logo={
          <Image src="/assets/logo.png" alt="logo" width={44} height={44} />
        }
        title="欢迎登录 亦忻面试刷题平台"
        subTitle={
          <Link href="https://github.com/NicknamePetName">
            亦忻面试刷题神器
          </Link>
        }
        onFinish={onFinish}
        actions={
          <Space>
            其他登录方式
            <AlipayCircleOutlined style={iconStyles} />
            <TaobaoCircleOutlined style={iconStyles} />
            <WeiboCircleOutlined style={iconStyles} />
          </Space>
        }
      >
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "40px",
            padding: "1px 10px",
            margin: "0",
            fontSize: "15px",
            backgroundImage:
              "linear-gradient(to top right, #b3e5fc 0%, #90caf9 50%, #673ab7 100%)",
            border: "solid 1px #1677ff",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          <Link href={"/user/register"}>注册</Link>
        </div>
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          items={items}
        ></Tabs>
        {loginType === "account" && (
          <>
            <ProFormText
              name="userAccount"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"用户名:"}
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
                {
                  min: 4,
                  message: "用户名长度不能小于4位！",
                }
              ]}
            />
            <ProFormText.Password
              name="userPassword"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"密码:"}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
                {
                  min: 8,
                  message: "密码长度不能小于8位！",
                },
              ]}
            />
          </>
        )}
        {loginType === "phone" && (
          <>
            <ProFormText
              fieldProps={{
                size: "large",
                prefix: <MobileOutlined className={"prefixIcon"} />,
              }}
              name="mobile"
              placeholder={"手机号"}
              rules={[
                {
                  required: true,
                  message: "请输入手机号！",
                },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: "手机号格式错误！",
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              captchaProps={{
                size: "large",
              }}
              placeholder={"请输入验证码"}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${"获取验证码"}`;
                }
                return "获取验证码";
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: "请输入验证码！",
                },
                {
                  pattern: /^\d{6}$/,
                  message: "验证码输入有误！",
                },
              ]}
              onGetCaptcha={async () => {
                message.success("获取验证码成功！验证码为：1234");
              }}
            />
          </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="rememberMe">
            记住我
          </ProFormCheckbox>
          <a
            style={{
              float: "right",
            }}
          >
            忘记密码
          </a>
        </div>
      </LoginForm>
    </div>
  );
};

export default UserLoginPage;
