"use client";
import {
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Dropdown, message } from "antd";
import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import GlobalFooter from "@/components/GlobalFooter";
import { menus } from "../../../config/menu";
import { AppDispatch, RootState } from "@/stores";
import { useDispatch, useSelector } from "react-redux";
import getAccessibleMenus from "@/access/menuAccess";
import { userLogoutUsingPost } from "@/api/userController";
import { values } from "lodash-es";
import { setLoginUser } from "@/stores/loginUser";
import { DEFAULT_USER } from "@/constants/user";
import SearchInput from "@/layouts/BasicLayout/components/SearchInput";
import "./index.css";

interface Props {
  children: React.ReactNode;
}

/**
 * 全局通用布局
 * @param children
 * @constructor
 */
export default function BasicLayout({ children }: Props) {
  const pathname = usePathname();
  const [messageApi, contextHolder] = message.useMessage();

  // 当前登录用户
  const loginUser = useSelector((state: RootState) => state.loginUser);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  /**
   * 用户注销
   */
  const userLogout = async () => {
    try {
      const res = await userLogoutUsingPost(values);
      if (res.data) {
        messageApi.success("已退出登录");
        dispatch(setLoginUser(DEFAULT_USER));
        router.push("/user/login");
      }
    } catch (e) {
      messageApi.error("操作失败：" + (e as Error).message);
    }
  };
  return (
    <div
      id="basic-layout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      {contextHolder}
      <ProLayout
        title="亦忻面试刷题平台"
        layout="top"
        logo={
          <Image
            src="/assets/logo.png"
            height={32}
            width={32}
            alt="亦忻面试刷题平台 - Nickname"
          />
        }
        location={{
          pathname,
        }}
        avatarProps={{
          src: loginUser.userAvatar || "/assets/notLoginUser.png",
          size: "small",
          title: loginUser.userName || "亦忻",
          render: (props, dom) => {
            if (!loginUser.id) {
              return (
                <Link
                  href={"/user/login"}
                  style={{ color: "rgba(0,0,0,0.45)" }}
                >
                  {dom}
                </Link>
              );
            }
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "退出登录",
                    },
                  ],
                  onClick: async (event: { key: React.Key }) => {
                    const { key } = event;
                    if (key === "logout") {
                      await userLogout();
                    }
                  },
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [];
          return [
            <SearchInput key="serch" />,
            <InfoCircleFilled key="InfoCircleFilled" />,
            <QuestionCircleFilled key="QuestionCircleFilled" />,
            <Link
              href="https://github.com/NicknamePetName/interview-front"
              key="github"
              target="_blank"
              style={{width: 28, height: 28, position: "relative",padding: 6}}
            >
              <GithubFilled key="GithubFilled" style={{position: "absolute", top: 6, left: 6}}/>
            </Link>,
          ];
        }}
        headerTitleRender={(logo, title, _) => {
          return (
            <a>
              {logo}
              {title}
            </a>
          );
        }}
        // 渲染底部栏
        footerRender={() => {
          return <GlobalFooter />;
        }}
        onMenuHeaderClick={(e) => {}}
        // 定义有哪些菜单
        menuDataRender={() => {
          return getAccessibleMenus(loginUser, menus);
        }}
        // 定义了菜单项如何渲染
        menuItemRender={(item, dom) => {
          const isCurrentPath = item.path && pathname === item.path;
          return (
            <Link href={item.path || "/"} target={item.target}>
              {isCurrentPath ? <span className="selected">{dom}</span> : dom}
            </Link>
          );
        }}
      >
        {children}
      </ProLayout>
    </div>
  );
}
