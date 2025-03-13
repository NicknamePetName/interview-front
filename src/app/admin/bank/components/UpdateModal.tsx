import { updateQuestionBankUsingPost } from "@/api/questionBankController";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";

interface Props {
  oldData?: API.QuestionBank;
  visible: boolean;
  columns: ProColumns<API.QuestionBank>[];
  onSubmit: (values: API.QuestionBankAddRequest) => void;
  onCancel: () => void;
}

/**
 * 更新弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { oldData, visible, columns, onSubmit, onCancel } = props;
  /**
   * 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.QuestionBankUpdateRequest) => {
    if (!fields?.title) {
      messageApi.error("标题不能为空");
      return false;
    }
    const hide = messageApi.loading("正在更新");
    try {
      await updateQuestionBankUsingPost(fields);
      hide();
      messageApi.success("更新成功");
      return true;
    } catch (e) {
      hide();
      messageApi.error("更新失败：" + (e as Error).message);
      return false;
    }
  };
  if (!oldData) {
    return <></>;
  }

  return (
    <div className="update-model">
      {contextHolder}
      <Modal
        destroyOnClose
        title={"更新"}
        open={visible}
        footer={null}
        onCancel={() => {
          onCancel?.();
        }}
      >
        <ProTable
          type="form"
          columns={columns}
          form={{
            initialValues: oldData,
          }}
          onSubmit={async (values: API.QuestionBankAddRequest) => {
            const success = await handleUpdate({
              ...values,
              id: oldData.id,
            });
            if (success) {
              onSubmit?.(values);
            }
          }}
        />
      </Modal>
    </div>
  );
};

export default UpdateModal;
