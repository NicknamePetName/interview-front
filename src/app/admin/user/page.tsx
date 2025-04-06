"use client";
import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import {
  deleteUserUsingPost,
  listUserByPageUsingPost,
} from "@/api/userController";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Space, Typography } from "antd";
import React, { useRef, useState } from "react";
import "./index.css";

/**
 * 用户管理页面
 *
 * @constructor
 */
const UserAdminPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.User>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.User) => {
    const hide = messageApi.loading("正在删除");
    if (!row) return true;
    try {
      await deleteUserUsingPost({
        id: row.id,
      });
      hide();
      messageApi.success("删除成功");
      actionRef?.current?.reload();
      return true;
    } catch (e) {
      hide();
      messageApi.error("删除失败：" + (e as Error).message);
      return false;
    }
  };
  /**
   * 表格列配置
   */
  const columns: ProColumns<API.User>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
    },
    {
      title: "账号",
      dataIndex: "userAccount",
      valueType: "text",
    },
    {
      title: "用户名",
      dataIndex: "userName",
      valueType: "text",
    },
    {
      title: "头像",
      dataIndex: "userAvatar",
      valueType: "image",
      fieldProps: {
        width: 33,
      },
      hideInSearch: true,
    },
    {
      title: "简介",
      dataIndex: "userProfile",
      valueType: "textarea",
    },
    {
      title: "权限",
      dataIndex: "userRole",
      valueEnum: {
        USER: {
          text: "用户",
        },
        ADMIN: {
          text: "管理员",
        },
        VIP: {
          text: "会员",
        },
      },
    },
    {
      title: "创建时间",
      sorter: true,
      dataIndex: "createTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "更新时间",
      sorter: true,
      dataIndex: "updateTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          <Popconfirm
            title="删除用户"
            description="是否删除此用户？"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Typography.Link type="danger">删除</Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div id="admin-user-page">
      {contextHolder}
      <PageContainer title="用户管理">
        <ProTable<API.User>
          headerTitle={"查询表格"}
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 60,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setCreateModalVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
          ]}
          request={async (params, sort, filter) => {
            const sortField = Object.keys(sort)?.[0] || "createTime";
            const sortOrder = sort?.[sortField] || "descend";

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const { data, code } = await listUserByPageUsingPost({
              ...params,
              sortField,
              sortOrder,
              ...filter,
            } as API.UserQueryRequest);

            return {
              success: code === 0,
              data: data?.records || [],
              total: Number(data?.total) || 0,
            };
          }}
          columns={columns}
        />
        <CreateModal
          visible={createModalVisible}
          columns={columns}
          onSubmit={() => {
            setCreateModalVisible(false);
            actionRef.current?.reload();
          }}
          onCancel={() => {
            setCreateModalVisible(false);
          }}
        />
        <UpdateModal
          visible={updateModalVisible}
          columns={columns}
          oldData={currentRow}
          onSubmit={() => {
            setUpdateModalVisible(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }}
          onCancel={() => {
            setUpdateModalVisible(false);
          }}
        />
      </PageContainer>
    </div>
  );
};
export default UserAdminPage;
