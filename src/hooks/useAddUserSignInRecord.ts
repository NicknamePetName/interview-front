import { useEffect, useState } from "react";
import "bytemd/dist/index.css";
import "highlight.js/styles/vs.css";
import "github-markdown-css/github-markdown-light.css";
import { message } from "antd";
import { addUserSignInUsingPost } from "@/api/userController";

/**
 * 添加用户刷题签到记录钩子
 *
 * @param props
 * @constructor
 */
const useAddUserSignInRecord = () => {
  // 签到状态
  const [loading, setLoading] = useState<boolean>(true);
  // 获取今天的日期
  const today = new Date().toISOString().split('T')[0];


  // 请求后端执行签到
  const doFetch = async () => {
    // 检查是否已经签到
    const signedInToday = localStorage.getItem(today);
    if (signedInToday) {
      setLoading(false);
      return; // 如果已经签到，则不执行签到操作
    }
    try {
      await addUserSignInUsingPost({});
      localStorage.setItem(today, 'signed-in'); // 签到成功后保存状态
    } catch (e) {
      message.error("刷题签到失败:" + (e as Error).message);
    }
    setLoading(false);
  };

  useEffect(() => {
    doFetch();
  }, []);

  return { loading };
};

export default useAddUserSignInRecord;
