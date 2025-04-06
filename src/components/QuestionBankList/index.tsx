"use client";
import { Avatar, Card, List, Typography } from "antd";
import "./index.css";
import Link from "next/link";

interface Props {
  questionBankList?: API.QuestionBankVO[];
}

/**
 * 题库列表组件
 * @param props
 * @constructor
 */
const QuestionBankList = (props: Props) => {
  const { questionBankList = [] } = props;

  const questionBankView = (questionBank: API.QuestionBankVO) => {
    return (
      <Card style={{ background: "rgba(214,230,248,0.7)" }}>
        <Link href={`/bank/${questionBank.id}`}>
          <Card.Meta
            style={{ background: "rgba(255,255,255,0)" }}
            avatar={<Avatar src={questionBank.picture || "/assets/logo.png"} />}
            title={questionBank.title}
            description={
              <Typography.Paragraph
                type="secondary"
                ellipsis={{ rows: 1 }}
                style={{ marginBottom: 0, background: "rgba(255,255,255,0)" }}
              >
                {questionBank.description}
              </Typography.Paragraph>
            }
          />
        </Link>
      </Card>
    );
  };

  return (
    <div className="question-bank-list">
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          column: 4,
        }}
        dataSource={questionBankList}
        renderItem={(item) => <List.Item>{questionBankView(item)}</List.Item>}
      />
    </div>
  );
};

export default QuestionBankList;
