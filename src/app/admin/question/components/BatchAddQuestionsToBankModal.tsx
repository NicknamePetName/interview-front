import { Button, Form, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import { batchAddQuestionsToBankUsingPost } from "@/api/questionBankQuestionController";

interface Props {
    questionIdList?: number[];
    visible: boolean;
    onSubmit: () => void;
    onCancel: () => void;
}

/**
 * 批量向题库添加题目弹窗
 * @param props
 * @constructor
 */
const BatchAddQuestionsToBankModal: React.FC<Props> = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { questionIdList = [], visible, onCancel, onSubmit } = props;
    const [form] = Form.useForm();
    const [questionBankList, setQuestionBankList] = useState<
        API.QuestionBankVO[]
    >([]);

    /**
     * 提交
     *
     * @param values
     */
    const doSubmit = async (values: API.QuestionBankQuestionBatchAddRequest) => {
        const hide = messageApi.loading("正在操作");
        const questionBankId = values.questionBankId;
        if (!questionBankId) {
            return;
        }
        try {
            await batchAddQuestionsToBankUsingPost({
                questionBankId,
                questionIdList,
            });
            hide();
            messageApi.success("操作成功");
            onSubmit?.();
        } catch (e) {
            hide();
            messageApi.error("操作失败，" + (e as Error).message);
        }
    };

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
        <div className="batch-add-questions-to-bank-modal">
            {contextHolder}
            <Modal
                destroyOnClose
                title={"批量向题库添加题目"}
                open={visible}
                footer={null}
                onCancel={() => {
                    onCancel?.();
                }}
            >
                <Form form={form} style={{ marginTop: 24 }} onFinish={doSubmit}>
                    <Form.Item label="选择题库" name="questionBankId">
                        <Select
                            style={{ width: "100%" }}
                            options={questionBankList.map((questionBank) => {
                                return {
                                    label: questionBank.title,
                                    value: questionBank.id,
                                };
                            })}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default BatchAddQuestionsToBankModal;