"use client";
import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import {
  deleteQuestionUsingPost,
  listQuestionByPageUsingPost,
} from "@/api/questionController";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Space, Typography } from "antd";
import React, { useRef, useState } from "react";
import "./index.css";
import TagList from "@/components/TagList";
import MdEditor from "@/components/MdEditor";

/**
 * 题目管理页面
 *
 * @constructor
 */
const QuestionAdminPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const actionRef = useRef<ActionType>();
  // 当前题目点击的数据
  const [currentRow, setCurrentRow] = useState<API.Question>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.Question) => {
    const hide = messageApi.loading("正在删除");
    if (!row) return true;
    try {
      await deleteQuestionUsingPost({
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
  const columns: ProColumns<API.Question>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
      sorter: true,
    },
    {
      title: "标题",
      dataIndex: "title",
      valueType: "text",
      width: 180,
    },
    {
      title: "内容",
      dataIndex: "content",
      valueType: "text",
      hideInSearch: true,
      width: 200,
      ellipsis: true,
      renderFormItem: (item, { fieldProps }, form) => {
        // 编写要渲染的表单项
        // value 和 onchange 会通过 form 自动注入
        return <MdEditor {...fieldProps} />;
      },
    },

    {
      title: "答案",
      dataIndex: "answer",
      valueType: "text",
      hideInSearch: true,
      width: 440,
      ellipsis: true,
      renderFormItem: (item, { fieldProps }, form) => {
        // 编写要渲染的表单项
        // value 和 onchange 会通过 form 自动注入
        return <MdEditor {...fieldProps} />;
      },
    },
    {
      title: "标签",
      dataIndex: "tags",
      valueType: "select",
      fieldProps: {
        mode: "tags",
      },
      valueEnum: {
        Java: { text: "Java" },
        Python: { text: "Python" },
        JavaScript: { text: "JavaScript" },
        MySQL: { text: "MySQL" },
        Redis: { text: "Redis" },
        Spring: { text: "Spring" },
        SpringBoot: { text: "SpringBoot" },
        Vue: { text: "Vue" },
      },
      render: (_, record) => {
        const tagList = JSON.parse(record.tags || "[]");
        return <TagList tagList={tagList} />;
      },
    },
    {
      title: "创建用户",
      dataIndex: "userId",
      valueType: "text",
      hideInForm: true,
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
      title: "编辑时间",
      sorter: true,
      dataIndex: "editTime",
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
            title="删除题目"
            description="是否删除此题目？"
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
    <div id="admin-question-page">
      {contextHolder}
      <PageContainer>
        <ProTable<API.Question>
          headerTitle={"查询表格"}
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: "auto",
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
            const sortField = Object.keys(sort)?.[0];
            const sortOrder = sort?.[sortField] ?? undefined;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const { data, code } = await listQuestionByPageUsingPost({
              ...params,
              sortField,
              sortOrder,
              ...filter,
            } as API.QuestionQueryRequest);

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
export default QuestionAdminPage;
