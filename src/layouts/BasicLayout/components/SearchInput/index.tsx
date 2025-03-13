import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import React from "react";
import "./index.css";
import { useRouter } from "next/navigation";

interface Props {}

/**
 * 标签列表组件
 * @param props
 * @constructor
 */
const SerachInput = (props: Props) => {
  const router = useRouter();

  return (
    <div
      className="search-input"
      key="SearchOutlined"
      aria-hidden
      style={{
        display: "flex",
        alignItems: "center",
        marginInlineEnd: 24,
      }}
    >
      <Input.Search
        style={{
          borderRadius: 4,
          marginInlineEnd: 12,
          background: "rgba(255, 255, 255, 0)",
          border: "none",
        }}
        prefix={<SearchOutlined />}
        placeholder="搜索题目"
        variant="borderless"
        onSearch={(value) => {
          router.push(`/questions?q=${value}`);
        }}
      />
    </div>
  );
};

export default SerachInput;
