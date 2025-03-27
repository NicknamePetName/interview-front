"use client";
import { Avatar, Card, Col, Row } from "antd";
import "./index.css";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { useState } from "react";
import CalendarChart from "@/app/user/center/components/CalendarChart";

/**
 * 用户中心页面
 * @constructor
 */

export default function UserCenterPage() {
  // 获取登录用户信息
  const loginUser = useSelector((state: RootState) => state.loginUser);
  // 便于服用，新启一个变量
  const user = loginUser;
  // 控制菜单栏的 Tab 高亮
  const [activeTabKey, setActiveTabKey] = useState<string>("record");

  return (
    <div id="user-center-page" className="max-width-content">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card style={{ textAlign: "center",background: "rgba(229, 233, 250, 0.8)" }} >
            <Avatar src={user.userAvatar} size={72} />
            <div style={{ marginBottom: "16px" }} />
            <Card.Meta
                style={{background: "rgba(255,255,255,0)"}}
              title={
                <Title level={4} style={{ marginBottom: 0 }}>
                  {user.userName}
                </Title>
              }
              description={
                <Paragraph type="secondary">{user.userProfile}</Paragraph>
              }
            ></Card.Meta>
          </Card>
        </Col>
        <Col xs={24} md={18}>
          <Card
              style={{background: "rgba(255,255,255,0.4)"}}
            tabList={[
              {
                key: "record",
                label: "刷题记录",
              },
              {
                key: "others",
                label: "其他",
              },
            ]}
            activeTabKey={activeTabKey}
            onTabChange={(key: string) => setActiveTabKey(key)}
          >
            {activeTabKey === "record" && (
              <>
                <CalendarChart />
              </>
            )}
            {activeTabKey === "others" && <>bbbb</>}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
