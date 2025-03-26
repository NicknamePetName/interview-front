"use client";
import { Card, List } from "antd";
import "./index.css";
import TagList from "@/components/TagList";
import Link from "next/link";

interface Props {
  questionBankId?: number;
  questionList?: API.QuestionVO[];
  cardTitle?: string;
}

/**
 * 题目列表组件
 * @param props
 * @constructor
 */
const questionList = (props: Props) => {
  const { questionBankId, questionList = [], cardTitle } = props;

  return (
    <div className="question-list" title={cardTitle}>
      <Card style={{ background: "rgba(229, 233, 250,0.5)" }}>
        <List
          header={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: 770, marginLeft: 20, fontWeight: 800 }}>
                {cardTitle ?? "题目列表"}
              </div>
              <div style={{ width: 400, fontWeight: 800 }}>标签</div>
            </div>
          }
          dataSource={questionList}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ width: 770, marginLeft: 20 }}>
                      <Link
                        href={
                          questionBankId
                            ? `/bank/${questionBankId}/question/${item.id}`
                            : `/question/${item.id}`
                        }
                        style={{
                          color: "rgb(43, 134, 255)",
                          fontWeight: 400,
                          fontSize: 14,
                        }}
                      >
                        <span>
                          {index + 1}. {item.title}
                        </span>
                      </Link>
                    </div>
                    <div
                      style={{
                        width: 400,
                        fontSize: 14,
                        color: "rgb(30,30,30)",
                        fontWeight: 400,
                      }}
                    >
                      <TagList tagList={item.tagList} />
                    </div>
                  </div>
                }
              ></List.Item.Meta>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default questionList;
