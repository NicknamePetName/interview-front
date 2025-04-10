import React from "react";
import "./index.css";

/**
 * 全部底部栏组件
 * @constructor
 */

export default function GlobeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="global-footer">
      <div>© {currentYear} 亦忻面试刷题平台</div>
      <div>
        <a href="https://cannianyixin.cn" target="_blank">
          作者：无锡大学 — 亦忻
        </a>
      </div>
    </div>
  );
}
