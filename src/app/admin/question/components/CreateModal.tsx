import { addQuestionUsingPost } from "@/api/questionController";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";

interface Props {
  visible: boolean;
  columns: ProColumns<API.Question>[];
  onSubmit: (values: API.QuestionAddRequest) => void;
  onCancel: () => void;
}

/**
 * 创建弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { visible, columns, onSubmit, onCancel } = props;
  /**
   * 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.QuestionAddRequest) => {
    if (!fields?.title) {
      messageApi.error("标题不能为空");
      return false;
    }
    const hide = messageApi.loading("正在添加");
    try {
      await addQuestionUsingPost(fields);
      hide();
      messageApi.success("创建成功");
      return true;
    } catch (e) {
      hide();
      messageApi.error("创建失败：" + (e as Error).message);
      return false;
    }
  };
  return (
    <div className="create-model">
      {contextHolder}
      <Modal
        destroyOnClose
        title={"创建"}
        open={visible}
        footer={null}
        onCancel={() => {
          onCancel?.();
        }}
      >
        <ProTable
          type="form"
          columns={columns}
          onSubmit={async (values: API.QuestionAddRequest) => {
            const success = await handleAdd(values);
            if (success) {
              onSubmit?.(values);
            }
          }}
        />
      </Modal>
    </div>
  );
};
export default CreateModal;
