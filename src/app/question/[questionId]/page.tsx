"use server";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import "./index.css";
import QuestionCard from "@/components/QuestionCard";
import { headers } from "next/headers";

/**
 * 题目详情页
 * @constructor
 */
export default async function QuestionPage({ params }) {
  const { questionId } = await params;
  // 获取当前请求的 Cookie
  const headersList = await headers(); // 使用 await 解析 headers
  const cookie = headersList.get("cookie");
  let errorMES: string = "获取题目详情失败，请刷新重试";
  // 获取题目详情
  let question = undefined;
  try {
    const res = await getQuestionVoByIdUsingGet(
      {
        id: questionId,
      },
      {
        headers: { cookie: cookie || "" }, // 手动传递 Cookie
      },
    );
    question = res.data;
  } catch (e) {
    errorMES = (e as Error).message || "获取题目详情失败，请刷新重试";
    console.error("获取题目详情失败：" + (e as Error).message);
  }

  // 错误数据处理
  if (!question) {
    return (
      <div
        style={{
          boxSizing: "border-box",
          margin: "0 auto",
          height: "100%",
          paddingTop: "18%",
        }}
      >
        {errorMES !== "window is not defined" ? errorMES : "未登录，请登录后重试" }
      </div>
    );
  }

  return (
    <div id="question-page" className="max-width-content">
      <QuestionCard question={question}></QuestionCard>
    </div>
  );
}
