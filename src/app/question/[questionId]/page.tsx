"use server";
import {getQuestionVoByIdUsingGet} from "@/api/questionController";
import "./index.css";
import QuestionCard from "@/components/QuestionCard";

/**
 * 题目详情页
 * @constructor
 */
export default async function QuestionPage({ params }) {
  const { questionId } = await params;

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



  return (
    <div id="question-page" className="max-width-content">
      <QuestionCard question={question}></QuestionCard>
    </div>
  );
}
