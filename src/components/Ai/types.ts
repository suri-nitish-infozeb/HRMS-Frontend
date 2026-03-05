/** Base fields present on all message types */
interface MessageBase {
  id?: string;
  role?: "user" | "assistant";
  timestamp?: string;
}

export interface TextMessage extends MessageBase {
  type: "text";
  content: string;
}

export interface TableMessage extends MessageBase {
  type: "table";
  title?: string;
  columns: string[];
  rows: Record<string, string>[];
}

export interface ChartMessage extends MessageBase {
  type: "chart";
  title?: string;
  chartType: "bar" | "pie" | "donut" | "line";
  labels: string[];
  values: number[];
}

export interface LinksMessage extends MessageBase {
  type: "links";
  title?: string;
  items: { label: string; url: string }[];
}

export interface GridCard {
  title: string;
  value: string;
  icon?: string;
  subtitle?: string;
  link?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export interface GridMessage extends MessageBase {
  type: "grid";
  title?: string;
  columns?: number;
  cards: GridCard[];
}

export interface MultiMessage extends MessageBase {
  type: "multi";
  blocks: Message[];
}

export type Message =
  | TextMessage
  | TableMessage
  | ChartMessage
  | LinksMessage
  | GridMessage
  | MultiMessage;
