import { updateQuestionUsingPost } from "@/api/questionController";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";

interface Props {
  oldData?: API.Question;
  visible: boolean;
  columns: ProColumns<API.Question>[];
  onSubmit: (values: API.QuestionAddRequest) => void;
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
  const handleUpdate = async (fields: API.QuestionUpdateRequest) => {
    if (!fields?.title) {
      messageApi.error("标题不能为空");
      return false;
    }
    const hide = messageApi.loading("正在更新");
    try {
      await updateQuestionUsingPost(fields);
      hide();
      messageApi.success("更新成功");
      return true;
    } catch (e) {
      hide();
      messageApi.error("更新失败：" + (e as Error).message);
      return false;
    }
  };

  if (!oldData?.id) {
    return <></>;
  }

  // 表单初始化值格式转换
  const initValues = { ...oldData}
  if (oldData?.tags) {
    initValues.tags = JSON.parse(oldData.tags) || [];
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
                initialValues: initValues,
              }}
              onSubmit={async (values: API.QuestionAddRequest) => {
                const success = await handleUpdate({
                  ...values,
                  id: oldData?.id,
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

