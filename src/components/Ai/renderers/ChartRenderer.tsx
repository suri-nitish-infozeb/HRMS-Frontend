import ReactECharts from "echarts-for-react";
import type { ChartMessage } from "../types";
import styles from "./ChartRenderer.module.css";

interface Props {
  message: ChartMessage;
}

function getThemeVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

function ChartRenderer({ message }: Props) {
  const theme = {
    colorPrimary: getThemeVar("--color-primary", "#4266f6"),
    colorPrimaryHover: getThemeVar("--color-primary-hover", "#5b7cff"),
    colorTextPrimary: getThemeVar("--color-text-primary", "#e2e8f0"),
    colorTextSecondary: getThemeVar("--color-text-secondary", "#94a3b8"),
    colorTextMuted: getThemeVar("--color-text-muted", "#64748b"),
    colorCanvasBg: getThemeVar("--color-canvas-bg", "rgba(24, 27, 36, 0.4)"),
    colorCanvasBorder: getThemeVar("--color-canvas-border", "rgba(107, 158, 255, 0.15)"),
    colorChartGrid: getThemeVar("--color-chart-grid", "rgba(255, 255, 255, 0.06)"),
    colorChartLine: getThemeVar("--color-chart-line", "#6b9eff"),
    colorChartAxis: getThemeVar("--color-chart-axis", "#e5e7eb"),
    colorShadowPrimary: getThemeVar("--color-shadow-primary", "rgba(66, 102, 246, 0.25)"),
  };

  const defaultColors = [
    "#a78bfa",
    "#f472b6",
    "#fb923c",
    "#34d399",
    "#60a5fa",
    "#f87171",
  ];

  const colors = message.colors ?? defaultColors;
  const { chartType, labels, values, title } = message;
  const isPolar = chartType === "pie" || chartType === "donut";

  const titleStyle = {
    text: title ?? "",
    left: "center",
    top: 8,
    textStyle: {
      fontSize: 14,
      fontWeight: 700,
      color: theme.colorTextPrimary,
    },
  };

  const option = isPolar
    ? {
        backgroundColor: "transparent",
        title: title ? titleStyle : undefined,
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)",
          backgroundColor: theme.colorCanvasBg,
          borderColor: theme.colorCanvasBorder,
          textStyle: { color: theme.colorTextPrimary },
        },
        legend: {
          bottom: 0,
          type: "scroll",
          textStyle: {
            color: theme.colorTextSecondary,
            fontSize: 12,
          },
        },
        color: colors,
        series: [
          {
            type: "pie",
            radius: chartType === "donut" ? ["42%", "68%"] : "62%",
            center: ["50%", "50%"],
            data: labels.map((label, i) => ({
              name: label,
              value: values[i],
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 12,
                shadowColor: theme.colorShadowPrimary,
              },
            },
            label: {
              formatter: "{b}: {d}%",
              fontSize: 12,
              color: theme.colorTextSecondary,
            },
          },
        ],
      }
    : {
        backgroundColor: "transparent",
        title: title ? titleStyle : undefined,
        tooltip: {
          trigger: "axis",
          backgroundColor: theme.colorCanvasBg,
          borderColor: theme.colorCanvasBorder,
          textStyle: { color: theme.colorTextPrimary },
        },
        color: colors,
        grid: {
          left: 50,
          right: 20,
          bottom: 60,
          top: title ? 50 : 24,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: labels,
          axisLabel: {
            rotate: labels.length > 4 ? 30 : 0,
            fontSize: 11,
            color: theme.colorTextMuted,
            interval: 0,
            overflow: "truncate",
            width: 100,
          },
          axisLine: {
            lineStyle: { color: theme.colorCanvasBorder },
          },
          axisTick: {
            lineStyle: { color: theme.colorCanvasBorder },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: theme.colorTextMuted,
            fontSize: 11,
          },
          splitLine: {
            lineStyle: { color: theme.colorChartGrid },
          },
          axisLine: { show: false },
        },
        series: [
          {
            data: values.map((v, i) => ({
              value: v,
              itemStyle: {
                color: colors[i % colors.length],
                borderRadius: [4, 4, 0, 0],
              },
            })),
            type: chartType === "line" ? "line" : "bar",
            smooth: chartType === "line",
            areaStyle:
              chartType === "line"
                ? {
                    opacity: 0.08,
                    color: colors[0],
                  }
                : undefined,
            barMaxWidth: 48,
          },
        ],
      };

  return (
    <div className={styles.wrapper}>
      <ReactECharts
        option={option}
        style={{ height: 300, width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}

export default ChartRenderer;