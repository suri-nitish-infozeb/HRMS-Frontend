export type Layout = { md?: number; lg?: number };

export type SlotName = "chart" | "table" | "text" | "list";

export type UIHtmlBlock = {
  id: string;
  slot: SlotName;
  layout?: Layout;
  html: string;
};

export type UIResponse = {
  uiHtml: UIHtmlBlock[];
};

export type ChartDataset = {
  label: string;
  data: number[];
};

export type ChartBlock = {
  id: string;
  slot: "chart";
  layout?: Layout;
  title?: string;
  chartType: "bar" | "line" | "pie" | "donut";
  labels: string[];
  datasets: ChartDataset[];
};

export type TableBlock = {
  id: string;
  slot: "table";
  layout?: Layout;
  title?: string;
  columns: string[];
  rows: (string | number)[][];
};

export type TextBlock = {
  id: string;
  slot: "text";
  layout?: Layout;
  content: string;
};