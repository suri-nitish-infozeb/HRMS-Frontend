import ReactECharts from "echarts-for-react";
import styles from "./ChartSlot.module.css";
import type { ChartBlock } from "../types";

type Props = {
  block: ChartBlock;
};

export default function ChartSlot({ block }: Props) {
  const option = {
    title: { show: false },
    tooltip: { trigger: "axis" as const },
    grid: { left: 40, right: 18, top: 16, bottom: 32 },

    xAxis: {
      type: "category" as const,
      data: block.labels,
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.18)" } },
      axisLabel: { color: "rgba(255,255,255,0.70)" }
    },
    yAxis: {
      type: "value" as const,
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.18)" } },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      axisLabel: { color: "rgba(255,255,255,0.70)" }
    },
    series: block.datasets.map((d) => ({
      name: d.label,
      type: block.chartType,
      data: d.data,
      barWidth: block.chartType === "bar" ? 26 : undefined
    }))
  };

  return (
    <div className={styles.surface}>
      <div className={styles.header}>
        <div className={styles.title}>{block.title ?? "Chart"}</div>
      </div>

      <div className={styles.body}>
        <ReactECharts option={option} style={{ height: 300, width: "100%" }} />
      </div>
    </div>
  );
}