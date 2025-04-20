"use client";
import { LockOutlined, MobileOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { message, Tabs } from "antd";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {getLoginUserUsingGet, userRegisterUsingPost} from "@/api/userController";
import { ProForm } from "@ant-design/pro-form/lib";
import "./index.css";
import { useRouter } from "next/navigation";

type RegisterType = "phone" | "account";
/**
 * 用户注册页面
 * @constructor
 */
const UserRegisterPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [registerType, setRegisterType] = useState<RegisterType>("account");
  const items = [
    { label: "账户密码注册", key: "account" },
    { label: "手机号注册", key: "phone" },
  ];
  const [form] = ProForm.useForm();
  const router = useRouter();

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

    /**
   * 提交
   */
  const onFinish = async (values: API.UserRegisterRequest) => {
    try {
      const res = await userRegisterUsingPost(values);
      if (res.data) {
        messageApi.success("注册成功");
        router.replace("/user/login");
        form.resetFields();
      }
    } catch (e) {
      messageApi.error("注册失败：" + (e as Error).message);
    }
  };

  return (
    <div id="user-register-page">
      {contextHolder}
      <LoginForm
        form={form}
        logo={
          <Image src="/assets/logo.png" alt="logo" width={44} height={44} />
        }
        title="欢迎注册 亦忻面试刷题平台"
        submitter={{
          searchConfig: {
            submitText: "注册",
          },
        }}
        subTitle={
          <Link href="https://github.com/NicknamePetName">
            亦忻面试刷题神器
          </Link>
        }
        onFinish={onFinish}
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
          <Link href={"/user/login"}>登录</Link>
        </div>
        <Tabs
          centered
          activeKey={registerType}
          onChange={(activeKey) => setRegisterType(activeKey as RegisterType)}
          items={items}
        ></Tabs>
        {registerType === "account" && (
          <>
            <ProFormText
              name="userAccount"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"用户名："}
              rules={[
                {
                  required: true,
                  message: "请输入用户名！",
                },
                {
                  min: 4,
                  message: "用户名长度不能小于4位！",
                },
              ]}
            />
            <ProFormText.Password
              name="userPassword"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"密码："}
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
            <ProFormText.Password
              name="checkPassword"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"确认密码："}
              rules={[
                {
                  required: true,
                  message: "请确认密码！",
                },
                {
                  min: 8,
                  message: "密码长度不能小于8位！",
                },
                {
                  validator: (_, value) => {
                    const userPassword = form.getFieldValue("userPassword");
                    if (
                      userPassword === undefined ||
                      value === undefined ||
                      userPassword.length < 8 ||
                      value.length < 8
                    ) {
                      // 如果 userPassword 为空，直接返回，因为前面的规则会处理
                      return Promise.resolve();
                    }
                    if (value !== userPassword) {
                      // 如果两次输入的密码不一致，报错
                      return Promise.reject(
                        new Error("两次输入的密码不一致！"),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              dependencies={["userPassword"]}
            />
          </>
        )}
        {registerType === "phone" && (
          <>
            <ProFormText
              fieldProps={{
                size: "large",
                prefix: <MobileOutlined className={"prefixIcon"} />,
              }}
              name="mobile"
              placeholder={"手机号："}
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
            <ProFormText.Password
              name="userPassword"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"密码："}
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
            <ProFormCaptcha
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              captchaProps={{
                size: "large",
              }}
              placeholder={"请输入验证码："}
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

export default UserRegisterPage;
