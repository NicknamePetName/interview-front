"use server";
import { Avatar, Button, Card } from "antd";
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import "./index.css";
import Meta from "antd/es/card/Meta";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import QuestionList from "@/components/QuestionList";

/**
 * 题库详情页
 * @constructor
 */
export default async function BankPage({ params }) {
  const { questionBankId } = params;
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

  // 获取第一道题目,用于 "开始刷题" 按钮跳转
  let firstQuestionId;
  if (bank.questionPage?.records && bank.questionPage.records.length > 0) {
    firstQuestionId = bank.questionPage.records[0].id;
  }

  return (
    <div id="bank-page" className="max-width-content">
      <Card style={{ background: "rgba(230,243,250,0.5)" }}>
        <Meta
          style={{ background: "rgba(255,255,255,0)" }}
          avatar={<Avatar src={bank.picture} />}
          title={<Title level={3}>{bank.title}</Title>}
          description={
            <>
              <Paragraph
                type="secondary"
                ellipsis={{ rows: 1 }}
                style={{
                  marginTop: -18,
                  marginBottom: 10,
                  background: "rgba(255,255,255,0)",
                }}
              >
                {bank.description}
              </Paragraph>
              <Button
                type="primary"
                shape="round"
                href={`/bank/${questionBankId}/question/${firstQuestionId}`}
                target="_blank"
                disabled={!firstQuestionId}
              >
                开始刷题
              </Button>
            </>
          }
        />
      </Card>
      <div style={{ marginBottom: 16 }} />
      <QuestionList
        questionBankId={questionBankId}
        questionList={bank.questionPage?.records ?? []}
        cardTitle={`题目列表（${bank.questionPage?.total || 0}）`}
      />
    </div>
  );
}
