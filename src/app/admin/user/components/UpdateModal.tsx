import { updateUserUsingPost } from "@/api/userController";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";

interface Props {
  oldData?: API.User;
  visible: boolean;
  columns: ProColumns<API.User>[];
  onSubmit: (values: API.UserAddRequest) => void;
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
  const newColumns: ProColumns<API.User>[] = columns.filter((item) => {
    return item.dataIndex !== "userAccount" ? item : null;
  });
  /**
   * 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.UserUpdateRequest) => {
    const hide = messageApi.loading("正在更新");
    try {
      await updateUserUsingPost(fields);
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
        <div
          style={{ width: 440, height: 30, paddingBottom: 8, marginLeft: 16 }}
        >
          账号
        </div>
        <div
          style={{
            color: "rgba(0, 0, 0, 0.88);)",
            display: "block",
            width: 440,
            height: 32.33,
            marginLeft: 16,
            marginBottom: 24,
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 11,
            paddingRight: 11,
            backgroundColor: "rgba(0,0,0,0)",
            border: "1px solid #d9d9d9",
            fontSize: 14,
            lineHeight: 1.5714285714285714,
            fontFamily:
              "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
            fontWeight: 400,
            borderRadius: 6,
          }}
        >
          {oldData.userAccount}
        </div>
        <ProTable
          type="form"
          columns={newColumns}
          form={{
            initialValues: oldData,
          }}
          onSubmit={async (values: API.UserAddRequest) => {
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
