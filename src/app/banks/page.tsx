"use server";
import {Divider, Flex} from "antd";
import Title from "antd/es/typography/Title";
import QuestionBankList from "@/components/QuestionBankList";
import {listQuestionBankVoByPageUsingPost} from "@/api/questionBankController";
import "./index.css";

/**
 * 题库列表页
 * @constructor
 */
export default async function BanksPage() {
  let questionBankList: API.QuestionBankVO[] = [];
  // 图库数量不多，直接全量获取
  const pageSize = 200;
  try {
    const res = await listQuestionBankVoByPageUsingPost({
      pageSize,
      sortField: "createTime",
      sortOrder: "desc",
    });
    questionBankList = res.data.records ?? [];
  } catch (e) {
      console.error("获取题库列表失败：" + (e as Error).message)
  }
  return (
    <div id="banks-page" className="max-width-content">
      <Flex justify="space-between" align="center">
        <Title level={3}>题库大全</Title>
      </Flex>
        <QuestionBankList questionBankList={questionBankList} />
      <Divider />
    </div>
  );
}
