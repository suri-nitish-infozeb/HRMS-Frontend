export type AIResponseType =
  | "text"
  | "table"
  | "chart"
  | "links"
  | "file"
  | "grid"
  | "multi";

export type ChartType = "bar" | "line" | "pie" | "donut" | "radar";

export type Role = "user" | "assistant";

export type ExportFormat = "pdf" | "xlsx" | "csv" | "docx" | "png";

export interface BaseMessage {
  id: string;
  role: Role;
  type: AIResponseType;
  timestamp?: string;
}

// ── Text ─────────────────────────────────────────────────
export interface TextMessage extends BaseMessage {
  type: "text";
  content: string;
}

// ── Table ────────────────────────────────────────────────
export interface TableMessage extends BaseMessage {
  type: "table";
  title?: string;
  columns: string[];
  rows: Record<string, string | number>[];
}

// ── Chart ────────────────────────────────────────────────
export interface ChartMessage extends BaseMessage {
  type: "chart";
  title?: string;
  chartType: ChartType;
  labels: string[];
  values: number[];
  colors?: string[];
}

// ── Links ────────────────────────────────────────────────
export interface LinksMessage extends BaseMessage {
  type: "links";
  title?: string;
  links: {
    label: string;
    url: string;
    description?: string;
    icon?: string;
  }[];
}

// ── File ─────────────────────────────────────────────────
export interface FileMessage extends BaseMessage {
  type: "file";
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
}

// ── Grid ─────────────────────────────────────────────────
export interface GridCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: string;
  link?: string;
}

export interface GridMessage extends BaseMessage {
  type: "grid";
  title?: string;
  columns?: 2 | 3 | 4;
  cards: GridCard[];
}

// ── Union (declare before MultiMessage uses it) ───────────
export type Message =
  | TextMessage
  | TableMessage
  | ChartMessage
  | LinksMessage
  | FileMessage
  | GridMessage
  | MultiMessage;

// ── Multi (multiple blocks) ───────────────────────────────
export interface MultiMessage extends BaseMessage {
  type: "multi";
  title?: string;
  blocks: Message[];
}


export interface ExportMeta {
  preferred: ExportFormat;
  options: ExportFormat[];
  fileName?: string;
}

export interface BaseMessage {
  id: string;
  role: Role;
  type: AIResponseType;
  timestamp?: string;
  export?: ExportMeta;   // ✅ add this
}
