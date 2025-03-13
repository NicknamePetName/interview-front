"use client";
import { Card, List } from "antd";
import "./index.css";
import TagList from "@/components/TagList";
import Link from "next/link";

interface Props {
  questionList?: API.QuestionVO[];
}

/**
 * 题目列表组件
 * @param props
 * @constructor
 */
const questionList = (props: Props) => {
  const { questionList = [] } = props;

  return (
    <div className="question-list">
      <Card style={{ background: "rgba(229, 233, 250,0.5)" }}>
        <List
          header={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: 770, marginLeft: 30 }}>题目列表</div>
              <div style={{ width: 400 }}>标签</div>
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
                    <div style={{ width: 770, marginLeft: 30 }}>
                      <Link href={`/question/${item.id}`} style={{color: "rgb(43, 134, 255)",fontWeight: 400, fontSize: 14}}>
                        <span>{index + 1}. {item.title}</span>
                      </Link>
                    </div>
                    <div style={{ width: 400, fontSize: 14, color: "rgb(30,30,30)", fontWeight: 400 }}>
                      <TagList tagList={item.tagList}/>
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
