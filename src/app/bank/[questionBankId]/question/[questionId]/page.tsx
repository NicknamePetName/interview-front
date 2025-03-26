"use server";
import { Flex, Menu } from "antd";
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import Title from "antd/es/typography/Title";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import "./index.css";
import QuestionCard from "@/components/QuestionCard";
import Link from "next/link";

/**
 * 题库题目详情页
 * @constructor
 */
export default async function BankQuestionPage({ params }) {
  const { questionBankId, questionId } = await params;

  // 获取题库详情
  let bank = undefined;
  try {
    const res = await getQuestionBankVoByIdUsingGet({
      id: questionBankId,
      needQueryQuestionList: true,
      // 可以扩展为分页实现
      pageSize: 200,
    });
    bank = res.data;
  } catch (e) {
    console.error("获取题库列表失败：" + (e as Error).message);
  }

  // 错误数据处理
  if (!bank) {
    return <div style={{boxSizing: "border-box",margin: "0 auto",height: "100%",paddingTop: "18%"}}>获取题库列表失败，请刷新重试</div>;
  }

  // 获取题目详情
  let question = undefined;
  try {
    const res = await getQuestionVoByIdUsingGet({
      id: questionId,
    });
    question = res.data;
  } catch (e) {
    console.error("获取题目详情失败：" + (e as Error).message);
  }

  // 错误数据处理
  if (!question) {
    return <div style={{boxSizing: "border-box",margin: "0 auto",height: "100%",paddingTop: "18%"}}>获取题目详情失败，请刷新重试</div>;
  }

  // 题目菜单列表
  const questionMenuItemList = (bank.questionPage?.records || []).map(
    (question) => {
      return {
        label: (
          <Link href={`/bank/${questionBankId}/question/${question.id}`}>
            {question.title}
          </Link>
        ),
        key: question.id,
      };
    },
  );

  return (
    <div id="bank-question-page">
      <Flex gap={24}>
        <Sider
          width={240}
          theme="light"
          style={{
            padding: "24px 0",
            background: "rgba(219, 227, 255, 0.7)",
            borderRadius: 8,
          }}
        >
          <Title
            level={3}
            style={{ padding: "0 20px", background: "rgba(219, 227, 255, 0)" }}
          >
            {bank.title}
          </Title>
          <Menu
            items={questionMenuItemList}
            selectedKeys={[question.id]}
            style={{ background: "rgba(219, 227, 255, 0)" }}
          />
        </Sider>
        <Content>
          <QuestionCard question={question}></QuestionCard>
        </Content>
      </Flex>
    </div>
  );
}
