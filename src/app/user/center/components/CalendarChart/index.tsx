import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import "bytemd/dist/index.css";
import "highlight.js/styles/vs.css";
import "github-markdown-css/github-markdown-light.css";
import "./index.css";
import dayjs from "dayjs";
import { message } from "antd";
import { getUserSignInRecordUsingGet } from "@/api/userController";

interface Props {}

/**
 * 刷题日历图
 *
 * @param props
 * @constructor
 */
const CalendarChart = (props: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const {} = props;

  // 签到日期列表 ([1,200], 表示第 1 和第 200 天有签到记录
  const [dataList, setDataList] = useState<number[]>([]);
  // 当前年份
  const year = new Date().getFullYear();

  // 请求后端获取数据
  const fetchDataList = async () => {
    try {
      const res = await getUserSignInRecordUsingGet({
        year,
      });
      setDataList(res.data);
    } catch (e) {
      messageApi.error("获取刷题签到记录失败:" + (e as Error).message);
    }
  };

  useEffect(() => {
    fetchDataList();
  }, []);

  // 计算图表所需要的数据
  const optionsData = dataList.map((dayOfYear) => {
    // 计算日期字符串
    const dateStr = dayjs(`${year}-01-01`)
      .add(dayOfYear - 1, "day")
      .format("YYYY-MM-DD");
    return [dateStr, 1];
  });

  // 图表配置
  const options = {
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange: {
        // 颜色从灰色到浅绿色
        color: ["#edf0f3", "#02ed43"],
      },
    },
    calendar: {
      range: year,
      top: 90,
      left: 20,
      // 单元格自动宽度，高度为 16 像素
      cellSize: ["auto", 16],
      yearLabel: {
        position: "top",
        formatter: `${year} 年刷题记录`,
        color: "#AAAAAA",
      },
      // 添加日历背景色和边框样式
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(130,0,253,0.5)",
        },
      },
      itemStyle: {
        borderWidth: 0.9,
        borderColor: "rgba(204,204,204,0.7)",
        color: "rgba(255,255,255,0)", // 修改日历单元格背景色
      },
      dayLabel: {
        color: "#666", // 修改日期字体颜色
      },
      monthLabel: {
        color: "#333", // 修改月份字体颜色
      },
    },
    series: [
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: optionsData,
        // 修改热力图的样式
        itemStyle: {
          borderColor: "#ddd",
        },
      }
    ],
  };

  return (
    <div className="calendar-chart">
      {contextHolder}
      <ReactECharts option={options} />
    </div>
  );
};

export default CalendarChart;
