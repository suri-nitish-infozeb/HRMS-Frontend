import ReactECharts from "echarts-for-react";
import type { ChartMessage } from "../types";
import styles from "./ChartRenderer.module.css";

interface Props {
  message: ChartMessage;
}

const DEFAULT_COLORS = [
  "#6b9eff", "#a78bfa", "#f472b6", "#fb923c",
  "#34d399", "#60a5fa", "#f87171", "#2dd4bf",
];

function ChartRenderer({ message }: Props) {
  const colors = message.colors ?? DEFAULT_COLORS;
  const { chartType, labels, values, title } = message;
  const isPolar = chartType === "pie" || chartType === "donut";

  const titleStyle = {
    text: title ?? "",
    left: "center",
    top: 8,
    textStyle: { fontSize: 14, fontWeight: "700", color: "#e2e8f0" },
  };

  const option = isPolar
    ? {
        backgroundColor: "transparent",
        title: title ? titleStyle : undefined,
        tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)", backgroundColor: "rgba(24,27,36,0.9)", borderColor: "rgba(107,158,255,0.2)", textStyle: { color: "#e2e8f0" } },
        legend: { bottom: 0, type: "scroll", textStyle: { color: "#94a3b8", fontSize: 12 } },
        color: colors,
        series: [{
          type: "pie",
          radius: chartType === "donut" ? ["42%", "68%"] : "62%",
          center: ["50%", "50%"],
          data: labels.map((label, i) => ({ name: label, value: values[i] })),
          emphasis: { itemStyle: { shadowBlur: 12, shadowColor: "rgba(107,158,255,0.4)" } },
          label: { formatter: "{b}: {d}%", fontSize: 12, color: "#94a3b8" },
        }],
      }
    : {
        backgroundColor: "transparent",
        title: title ? titleStyle : undefined,
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(24,27,36,0.95)",
          borderColor: "rgba(107,158,255,0.2)",
          textStyle: { color: "#e2e8f0" },
        },
        color: colors,
        grid: { left: 50, right: 20, bottom: 60, top: title ? 50 : 24, containLabel: true },
        xAxis: {
          type: "category",
          data: labels,
          axisLabel: { rotate: labels.length > 4 ? 30 : 0, fontSize: 11, color: "#64748b", interval: 0, overflow: "truncate", width: 100 },
          axisLine: { lineStyle: { color: "rgba(107,158,255,0.15)" } },
          axisTick: { lineStyle: { color: "rgba(107,158,255,0.15)" } },
        },
        yAxis: {
          type: "value",
          axisLabel: { color: "#64748b", fontSize: 11 },
          splitLine: { lineStyle: { color: "rgba(107,158,255,0.08)" } },
          axisLine: { show: false },
        },
        series: [{
          data: values.map((v, i) => ({
            value: v,
            itemStyle: { color: colors[i % colors.length], borderRadius: [4, 4, 0, 0] },
          })),
          type: chartType === "line" ? "line" : "bar",
          smooth: chartType === "line",
          areaStyle: chartType === "line" ? { opacity: 0.08, color: colors[0] } : undefined,
          barMaxWidth: 48,
        }],
      };

  return (
    <div className={styles.wrapper}>
      <ReactECharts option={option} style={{ height: 300, width: "100%" }} opts={{ renderer: "svg" }} />
    </div>
  );
}

export default ChartRenderer;