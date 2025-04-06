"use client";
import { Button, Form, Input, InputNumber, message } from "antd";
import React, { useState } from "react";
import { aiGenerateQuestionsUsingPost } from "@/api/questionController";
import "./index.css";

interface Props {}

/**
 * AI 生成题目页面
 * @param props
 * @constructor
 */
const AiGenerateQuestionPage: React.FC<Props> = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  /**
   * 提交
   *
   * @param values
   */
  const doSubmit = async (values: API.QuestionAIGenerateRequest) => {
    const hide = messageApi.loading("正在操作");
    setLoading(true);
    try {
      await aiGenerateQuestionsUsingPost(values);
      hide();
      messageApi.success("操作成功");
    } catch (e) {
      hide();
      messageApi.error("操作失败，" + (e as Error).message);
    }
    setLoading(false);
  };

  return (
    <div id="ai-generate-question-page">
      {contextHolder}
      <h2>AI 生成题目</h2>
      <Form form={form} style={{ marginTop: 24 }} onFinish={doSubmit}>
        <Form.Item
          label="题目方向"
          name="questionType"
          style={{ background: "rgba(255,255,255,0)" }}
        >
          <Input
            placeholder="比如 Java"
            style={{ width: 480, background: "rgba(255,255,255,0.5)" }}
          />
        </Form.Item>
        <Form.Item
          label="题目数量"
          name="number"
          style={{ background: "rgba(255,255,255,0)" }}
        >
          <InputNumber
            defaultValue={10}
            max={50}
            min={1}
            style={{ width: 480, background: "rgba(255,255,255,0.5)" }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            style={{ width: 150 }}
            type="primary"
            htmlType="submit"
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default AiGenerateQuestionPage;
