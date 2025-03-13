"use server";
import Title from "antd/es/typography/Title";
import {listQuestionVoByPageUsingPost} from "@/api/questionController";
import QuestionTable from "@/components/QuestionTable";
import "./index.css";

/**
 * 题目列表页
 * @constructor
 */
interface SearchParams {
  q?: string;
}

export default async function QuestionsPage({ searchParams }: { searchParams: SearchParams }) {
  // 获取 url 的查询参数
  const { q: searchText } = searchParams;
  let questionList: API.QuestionBankVO[] = [];
  let total = 0;

  try {
    const res = await listQuestionVoByPageUsingPost({
      title: searchText,
      pageSize: 12,
      sortField: "createTime",
      sortOrder: "descend",
    });
    questionList = res.data.records ?? [];
    total = res.data.total ?? 0;
  } catch (e) {
    console.error("获取题目列表失败：" + (e as Error).message);
  }
  return (
    <div id="questionsPage" className="max-width-content">
      <Title level={3}>题目大全</Title>
      <QuestionTable
        defaultQuestionList={questionList}
        defaultTotal={total}
        defaultSearchParams={{
          title: searchText,
        }}
      />
    </div>
  );
}
