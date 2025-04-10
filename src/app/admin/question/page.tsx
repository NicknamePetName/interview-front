"use client";
import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import {
  batchDeleteQuestionsUsingPost,
  deleteQuestionUsingPost,
  listQuestionByPageUsingPost,
} from "@/api/questionController";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import {Button, message, Popconfirm, Space, Table, Tag, Typography} from "antd";
import React, { useRef, useState } from "react";
import TagList from "@/components/TagList";
import MdEditor from "@/components/MdEditor";
import UpdateBankModal from "./components/UpdateBankModal";
import BatchAddQuestionsToBankModal from "./components/BatchAddQuestionsToBankModal";
import BatchRemoveQuestionsFromBankModal from "./components/BatchRemoveQuestionsFromBankModal";
import "./index.css";

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
  // 是否显示更新所属题库窗口
  const [updateBankModalVisible, setUpdateBankModalVisible] =
    useState<boolean>(false);
  // 是否显示批量向题库添加题目弹窗
  const [
    batchAddQuestionsToBankModalVisible,
    setBatchAddQuestionsToBankModalVisible,
  ] = useState<boolean>(false);
  // 是否显示批量从题库移除题目弹窗
  const [
    batchRemoveQuestionsFromBankModalVisible,
    setBatchRemoveQuestionsFromBankModalVisible,
  ] = useState<boolean>(false);
  // 当前选中的题目 id 列表
  const [selectedQuestionIdList, setSelectedQuestionIdList] = useState<
    number[]
  >([]);
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
   * 批量删除节点
   *
   * @param questionIdList
   */
  const handleBatchDelete = async (questionIdList: number[]) => {
    const hide = messageApi.loading("正在操作");
    try {
      await batchDeleteQuestionsUsingPost({
        questionIdList,
      });
      hide();
      messageApi.success("操作成功");
      actionRef?.current?.reload();
    } catch (e) {
      hide();
      messageApi.error("操作失败，" + (e as Error).message);
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
      ellipsis: true,
    },
    {
      title: "所属题库",
      dataIndex: "questionBankId",
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: "标题",
      dataIndex: "title",
      valueType: "text",
      width: 180,
      ellipsis: true,
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
      width: 400,
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
        "待审核": { text: "待审核" },
      },
      render: (_, record) => {
        const tagList = JSON.parse(record.tags || "[]");
        return <TagList tagList={tagList} />;
      },
    },
    {
      title: "审核状态",
      dataIndex: "reviewStatus",
      valueType: "select",
      hideInTable: true,
      valueEnum: {
        0: { text: "待审核" },
        1: { text: "通过" },
        2: { text: "拒绝" },
      },
      render: (_, record) => {
        let tag;
        switch (record.reviewStatus) {
          case 0:
            tag = "待审核";
            break;
          case 1:
            tag = "通过";
            break;
          case 2:
            tag = "拒绝";
            break;
          default:
            tag = "未知状态";
        }
        return <Tag>{tag}</Tag>;
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
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateBankModalVisible(true);
            }}
          >
            题库
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
          // 滚动栏
          // scroll={{
          //   x: 1500,
          // }}
          search={{
            labelWidth: "auto",
          }}
          rowSelection={{
            // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
            // 注释该行则默认不显示下拉选项
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
            // defaultSelectedRowKeys: [1],
          }}
          tableAlertRender={({
            selectedRowKeys,
            selectedRows,
            onCleanSelected,
          }) => {
            console.log(selectedRowKeys, selectedRows);
            return (
              <Space size={24}>
                <span>
                  已选 {selectedRowKeys.length} 项
                  <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                    取消选择
                  </a>
                </span>
              </Space>
            );
          }}
          tableAlertOptionRender={({
            selectedRowKeys,
            selectedRows,
            onCleanSelected,
          }) => {
            return (
              <Space size={16}>
                <Button
                  onClick={() => {
                    // 打开弹窗
                    setSelectedQuestionIdList(selectedRowKeys as number[]);
                    setBatchAddQuestionsToBankModalVisible(true);
                  }}
                >
                  批量向题库添加题目
                </Button>
                <Button
                  onClick={() => {
                    // 打开弹窗
                    setSelectedQuestionIdList(selectedRowKeys as number[]);
                    setBatchRemoveQuestionsFromBankModalVisible(true);
                  }}
                >
                  批量从题库移除题目
                </Button>
                <Popconfirm
                  title="确认删除"
                  description="是否删除这些题目？"
                  onConfirm={() => {
                    // 执行批量删除操作
                    handleBatchDelete(selectedRowKeys as number[]);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>批量删除题目</Button>
                </Popconfirm>
              </Space>
            );
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              ghost
              key="primary"
              href="/admin/question/ai"
              target="_blank"
            >
              <PlusOutlined /> AI 生成题目
            </Button>,
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
        <UpdateBankModal
          visible={updateBankModalVisible}
          questionId={currentRow?.id}
          onCancel={() => {
            setUpdateBankModalVisible(false);
          }}
        />
        <BatchAddQuestionsToBankModal
          visible={batchAddQuestionsToBankModalVisible}
          questionIdList={selectedQuestionIdList}
          onSubmit={() => {
            setBatchAddQuestionsToBankModalVisible(false);
          }}
          onCancel={() => {
            setBatchAddQuestionsToBankModalVisible(false);
          }}
        />
        <BatchRemoveQuestionsFromBankModal
          visible={batchRemoveQuestionsFromBankModalVisible}
          questionIdList={selectedQuestionIdList}
          onSubmit={() => {
            setBatchRemoveQuestionsFromBankModalVisible(false);
          }}
          onCancel={() => {
            setBatchRemoveQuestionsFromBankModalVisible(false);
          }}
        />
      </PageContainer>
    </div>
  );
};
export default QuestionAdminPage;
