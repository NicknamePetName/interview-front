"use client";
import { Avatar, Button, Card, Input, List, message, Tag } from "antd";
import React, { useEffect, useState } from "react";
import {
  getMockInterviewByIdUsingGet,
  handleMockInterviewEventUsingPost,
} from "@/api/mockInterviewController";
import "./index.css";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";

interface Message {
  role: string;
  content: string;
  isAI: boolean;
}

interface MockInterviewDetail extends API.MockInterview {
  parsedMessages?: Message[];
}

export default function InterviewRoomPage({ params }) {
  const loginUser = useSelector((state: RootState) => state.loginUser);
  const { mockInterviewId } = params;
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [interview, setInterview] = useState<MockInterviewDetail>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  // 加载面试数据
  const loadInterview = async () => {
    try {
      const res = await getMockInterviewByIdUsingGet({ id: mockInterviewId });
      const data = res.data as MockInterviewDetail;
      // 解析历史消息
      if (data.messages) {
        data.parsedMessages = JSON.parse(data.messages);
        setMessages(data.parsedMessages || []);
      }

      setInterview(data);
      setIsStarted(data.status === 1);
      setIsEnded(data.status === 2);
    } catch (error) {
      message.error("加载面试数据失败");
    }
  };

  useEffect(() => {
    loadInterview();
  }, []);

  // 处理事件
  const handleEvent = async (eventType: string, msg?: string) => {
    setLoading(true);
    try {
      const res = await handleMockInterviewEventUsingPost({
        event: eventType,
        id: interview?.id,
        message: msg,
      });

      // 更新消息列表
      const newMessage: Message = {
        content: msg || (eventType === "start" ? "面试开始" : "面试结束"),
        role: "user",
        isAI: false,
      };

      const aiResponse: Message = {
        content: res.data || "收到请求",
        role: "assistant",
        isAI: true,
      } as any;

      setMessages([...messages, newMessage, aiResponse]);

      // 更新状态
      if (eventType === "start") setIsStarted(true);
      if (eventType === "chat" && res.data.includes("【面试结束】")) {
        setIsEnded(true);
      }
      if (eventType === "end") setIsEnded(true);
    } catch (error) {
      message.error("操作失败");
    } finally {
      setLoading(false);
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    await handleEvent("chat", inputMessage);
    setInputMessage("");
  };

  return (
    <div id="interview-room-page" className="max-width-content">
      {/* 标题 */}
      <div className="header">
        <h1>
          模拟面试 {interview ? `#${interview.id} — ${interview.jobPosition}` : ""}
        </h1>
        <Tag color={isEnded ? "red" : isStarted ? "green" : "orange"}>
          {isEnded ? "已结束" : isStarted ? "进行中" : "待开始"}
        </Tag>
      </div>

      {/* 操作按钮 */}
      <div className="action-buttons">
        <Button
          type="primary"
          onClick={() => handleEvent("start")}
          disabled={isStarted || isEnded}
          loading={loading}
        >
          开始面试
        </Button>
        <Button
          danger
          onClick={() => handleEvent("end")}
          disabled={!isStarted || isEnded}
          loading={loading}
        >
          结束面试
        </Button>
      </div>

      {/* 消息列表 */}
      <Card className="message-area">
        <List
          style={{ background: "rgba(255,255,255,0)" }}
          dataSource={messages}
          split={false}
          renderItem={(item) => {
            // 如果 role 是 "system"，则不渲染任何内容
            if (item.role === "system") return null;
            if (item.message === "开始") {
              item.message = "面试开始";
            }
            if (item.message === "结束") {
              item.message = "面试结束";
            }
            if (item.role === "assistant") {
              return (
                <List.Item
                  style={{
                    position: "relative", // 设置相对定位以便内部元素绝对定位
                    display: "flex", // 设置弹性盒模型以便更好地布局
                    alignItems: "flex-start", // 垂直对齐方式为顶部对齐
                  }}
                >
                  <div
                    style={{
                      position: "absolute", // 绝对定位
                      top: 20, // 距离顶部10px
                      left: -10, // 距离左侧10px
                    }}
                  >
                    <Avatar src="/assets/logo.png" size={35} />
                  </div>

                  {/* 消息气泡 */}
                  <div
                    className={`message-bubble ai`}
                    style={{
                      marginLeft: 30, // 距离左侧60px，为头像留出空间
                      padding: "10px", // 内边距
                    }}
                  >
                    <div className="message-content">
                      {item.content || item.message}
                    </div>
                  </div>
                </List.Item>
              );
            }

            return (
              <List.Item
                style={{
                  position: "relative", // 设置相对定位以便内部元素绝对定位
                  display: "flex", // 设置弹性盒模型以便更好地布局
                  justifyContent: "flex-end",
                }}
              >
                <div
                  className={`message-bubble user`}
                  style={{
                    marginRight: 30, // 距离左侧60px，为头像留出空间
                    padding: "10px", // 内边距
                  }}
                >
                  <div className="message-content">
                    {item.content || item.message}
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute", // 绝对定位
                    top: 20, // 距离顶部10px
                    right: -10, // 距离左侧10px
                  }}
                >
                  <Avatar
                    src={loginUser.userAvatar || `/assets/logo-user.png`}
                    size={35}
                  />
                </div>
              </List.Item>
            );
          }}
        />
      </Card>

      {/* 输入区域 */}
      <div className="input-area">
        <Input.TextArea
          style={{ background: "rgba(255,255,255,0.3)" }}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="输入你的回答..."
          disabled={!isStarted || isEnded}
          rows={1}
        />
        <Button
          type="primary"
          onClick={sendMessage}
          loading={loading}
          disabled={!isStarted || isEnded}
        >
          发送
        </Button>
      </div>
    </div>
  );
}
