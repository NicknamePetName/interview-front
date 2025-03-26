import { Form, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  addQuestionBankQuestionUsingPost,
  listQuestionBankQuestionVoByPageUsingPost,
  removeQuestionBankUsingPost,
} from "@/api/questionBankQuestionController";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";

interface Props {
  questionId?: number;
  visible: boolean;
  onCancel: () => void;
}

/**
 * 更新题目所属题库弹窗
 * @param props
 * @constructor
 */
const UpdateBankModal: React.FC<Props> = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { questionId, visible, onCancel } = props;
  const [form] = Form.useForm();
  const [questionBankList, setQuestionBankList] = useState<
    API.QuestionBankVO[]
  >([]);

  // 获取所属题库列表
  const getCurrentQuestionBankIdList = async () => {
    try {
      const res = await listQuestionBankQuestionVoByPageUsingPost({
        questionId,
        pageSize: 20,
      });
      const list = (res.data?.records ?? []).map((item) => item.questionBankId);
      form.setFieldValue("questionBankIdList", list);
    } catch (e) {
      messageApi.error("获取题目所属题库列表失败，" + (e as Error).message);
    }
  };

  useEffect(() => {
    if (questionId) {
      getCurrentQuestionBankIdList();
    }
  }, [questionId]);

  // 获取题库列表
  const getQuestionBankList = async () => {
    // 题库数量不多，直接全量获取
    const pageSize = 200;

    try {
      const res = await listQuestionBankVoByPageUsingPost({
        pageSize,
        sortField: "createTime",
        sortOrder: "descend",
      });
      setQuestionBankList(res.data?.records ?? []);
    } catch (e) {
      messageApi.error("获取题库列表失败，" + (e as Error).message);
    }
  };

  useEffect(() => {
    getQuestionBankList();
  }, []);

  return (
    <div className="update-bank-model">
      {contextHolder}
      <Modal
        destroyOnClose
        title={"更新所属题库"}
        open={visible}
        footer={null}
        onCancel={() => {
          onCancel?.();
        }}
      >
        <Form form={form} style={{ marginTop: 24 }}>
          <Form.Item label="所属题库" name="questionBankIdList">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              options={questionBankList.map((questionBank) => {
                return {
                  label: questionBank.title,
                  value: questionBank.id,
                };
              })}
              onSelect={async (value) => {
                const hide = messageApi.loading("正在更新");
                try {
                  await addQuestionBankQuestionUsingPost({
                    questionId,
                    questionBankId: value,
                  });
                  hide();
                  messageApi.success("绑定题库成功");
                } catch (e) {
                  hide();
                  messageApi.error("绑定题库失败，" + (e as Error).message);
                }
              }}
              onDeselect={async (value) => {
                const hide = messageApi.loading("正在更新");
                try {
                  await removeQuestionBankUsingPost({
                    questionId,
                    questionBankId: value,
                  });
                  hide();
                  messageApi.success("取消绑定题库成功");
                } catch (e) {
                  hide();
                  messageApi.error("取消绑定题库失败，" + (e as Error).message);
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default UpdateBankModal;
