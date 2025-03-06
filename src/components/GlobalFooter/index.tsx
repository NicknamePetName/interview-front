import React from "react";
import "./index.css";

/**
 * 全部底部栏组件
 * @constructor
 */

export default function GlobeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <div
      className="globe-footer"
      style={{
        textAlign: "center",
        paddingBlockStart: 12,
      }}
    >
      <div>© {currentYear} 面试刷题平台</div>
      <div>
        <a href="https://interview.cannianyixin.cn" target="_blank">
          作者：无锡学院&优课达 — 亦忻
        </a>
      </div>
    </div>
  );
}
