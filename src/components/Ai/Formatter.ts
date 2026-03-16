import axios from "axios";
import type {
  TextMessage,
  TableMessage,
  ChartMessage,
  LinksMessage,
  GridMessage,
  MultiMessage,
  Message,
} from "./types";

type FormattedMessage =
  | TextMessage
  | TableMessage
  | ChartMessage
  | LinksMessage
  | GridMessage
  | MultiMessage;

const AZURE_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_KEY = import.meta.env.VITE_AZURE_OPENAI_KEY;
const AZURE_DEPLOYMENT = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT;
const AZURE_API_VERSION = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

const MAX_REPLY_CHARS = 3000;

const SYSTEM_PROMPT = `
You are an intelligent UI formatter for a modern HR dashboard.

You receive:
- USER PROMPT: what the user originally asked
- AI REPLY: raw text from the HR assistant

Return ONLY valid JSON. No explanation. No markdown. No code fences. Just raw JSON.

PRIORITY RULE:
If USER PROMPT explicitly mentions a format, YOU MUST USE IT.

SEPARATE / INDIVIDUAL OUTPUT RULE (HIGHEST PRIORITY):
If USER PROMPT contains any intent like:
- "separate" / "separately" / "individual" / "one by one" / "each one" / "each" / "for each"
THEN you MUST return type: "multi" with multiple blocks (one block per item/entity/role).

If the user ALSO specifies a format word, every block MUST use that format:
- "separate table(s)" / "table separately" -> each block is type: "table"
- "separate chart(s)" / "charts separately" -> each block is type: "chart"
- "separate grid/cards" -> each block is type: "grid"
- "separate links" -> each block is type: "links"
- "separate text" -> each block is type: "text"

If the user says "separate" but DOES NOT specify format:
- You still must return type: "multi"
- Choose the best format PER block using FORMAT DECISION rules.

Other format triggers (when NOT separate):
- "table" / "tabular"     -> type: "table"
- "chart" / "bar" / "pie" -> type: "chart" with that chartType
- "donut"                 -> type: "chart", chartType: "donut"
- "line chart"            -> type: "chart", chartType: "line"
- "grid" / "cards"        -> type: "grid"
- "links"                 -> type: "links"
This overrides everything else (except the separate/individual rule above).

FORMAT DECISION (when user did not specify):
- List of items with multiple attributes         -> table
- Numerical comparison across categories         -> chart (bar)
- Parts of a whole / distribution                -> chart (pie or donut)
- Trend over time                                -> chart (line)
- Key metrics / KPI summaries / stat counts      -> grid
- URLs or resource references                    -> links
- Conversation / explanation / single answer     -> text

GRID CARD RULES - THIS IS CRITICAL:
When rendering a grid, EVERY piece of information from the AI REPLY must appear in the card.
Use these fields:
- title      -> The main identifier (department name, job title, person name, etc.)
- value      -> The most important metric or status (e.g. "3 Active Jobs", "5 Resumes")
- icon       -> A relevant emoji
- subtitle   -> Pack ALL secondary details here as a compact string using pipe separators.
               Format: "Key1: Val1 | Key2: Val2 | Key3: Val3"
               Example: "Resumes: 3 | Level: Senior | Skills: React, Node | Requirements: 5+ yrs"
               Include job titles, resume counts, skills, requirements, responsibilities - everything.
               NEVER leave data out. If there are multiple job titles, list them all here.
- link       -> include the URL string if there is a direct career page or excel link for this item
- trend      -> "up" / "down" / "neutral" - only if there is a real trend in the data, otherwise omit
- trendValue -> SHORT string only like "+12%" or "3 open" - omit if no real trend, NEVER a sentence

CONTEXT RULE:
If USER PROMPT is a follow-up like:
- "in grid", "as cards", "show as table", "in chart"
- OR any "separate"/"separately"/"each one"/"one by one"/"individual"

Then you MUST use ALL data from AI REPLY and reformat it.

For "separate" requests:
- Identify the distinct items/entities/roles in the AI REPLY (e.g., each job role, each department, each employee).
- Create ONE block per item/entity/role.
- Each block must be complete and self-contained (do not merge all items into one block).
- Give each block a clear title naming the item/entity/role.

OUTPUT SCHEMAS:

TEXT:
{ "type": "text", "content": "..." }

TABLE:
{ "type": "table", "title": "...", "columns": ["Col1","Col2"], "rows": [{"Col1":"val","Col2":"val"}] }

CHART:
{ "type": "chart", "title": "...", "chartType": "bar" or "pie" or "donut" or "line", "labels": ["..."], "values": [42] }

GRID:
{
  "type": "grid",
  "title": "...",
  "columns": 2 or 3 or 4,
  "cards": [
    {
      "title": "Main Label",
      "value": "Primary Metric",
      "icon": "emoji",
      "subtitle": "JobTitles: X, Y | Resumes: 3 | Skills: A, B | Requirements: C",
      "link": "https://... only if a direct URL exists for this card",
      "trend": "up or down or neutral - omit if not applicable",
      "trendValue": "+12% - omit if not applicable, never a long sentence"
    }
  ]
}

LINKS:
{ "type": "links", "title": "...", "links": [{ "label": "...", "url": "...", "description": "..." }] }

MULTI (multiple outputs):
{
  "type": "multi",
  "title": "...optional...",
  "blocks": [
    { ...any valid schema above... },
    { ...any valid schema above... }
  ]
}
  
EXPORT DECISION RULE:

Every response MUST include an "export" object.

Decide best download format based on response type:

- table  -> preferred: "xlsx", options: ["xlsx","csv","pdf"]
- chart  -> preferred: "png",  options: ["png","pdf"]
- grid   -> preferred: "pdf",  options: ["pdf","xlsx"]
- text   -> preferred: "docx", options: ["docx","pdf"]
- links  -> preferred: "csv",  options: ["csv","pdf"]
- multi  -> preferred: "pdf",  options: ["pdf"]

Schema:

"export": {
  "preferred": "format",
  "options": ["format1","format2"]
}

STRICT RULES:
1. Return raw JSON only - no markdown, no explanation, no code fences
2. NEVER leave data out of grid cards - pack everything into subtitle
3. trendValue must be under 6 words. Never a full sentence.
4. Preserve all URLs - include them in the link field
5. If truly nothing can be structured, use text
6. If the user asks for "separate"/"separately"/"each one"/"one by one"/"individual"/"for each", you MUST return type:"multi".
7. In multi, NEVER merge multiple items into one table/chart/grid. Use ONE block per item/entity/role.
8. Each block must include all relevant information for that specific item/entity/role.
`.trim();

function ensureMeta<T extends Record<string, any>>(m: T): T {
  const id =
    typeof m.id === "string" && m.id.trim().length ? m.id : crypto.randomUUID();
  const role = m.role ?? "assistant";
  return { ...m, id, role };
}

export async function formatReplyToMessage(
  reply: string,
  userPrompt: string
): Promise<FormattedMessage> {
  const url = `${AZURE_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;

  const truncatedReply =
    reply.length > MAX_REPLY_CHARS
      ? reply.slice(0, MAX_REPLY_CHARS) + "\n...[truncated]"
      : reply;

  console.log(" Formatting reply with Azure OpenAI...");

  const userMessage = `USER PROMPT: ${userPrompt}\n\nAI REPLY:\n${truncatedReply}`;

  try {
    const res = await axios.post(
      url,
      {
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0,
        max_tokens: 2000,
      },
      {
        headers: {
          "api-key": AZURE_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = res.data.choices[0].message.content as string;
    console.log(" Formatter raw output:", raw);

    const parsed = JSON.parse(raw.trim()) as FormattedMessage;
    console.log(" Formatted as:", (parsed as any).type, parsed);

    // Ensure IDs/role exist (also for multi blocks)
    if ((parsed as any).type === "multi") {
      const blocks = Array.isArray((parsed as any).blocks) ? (parsed as any).blocks : [];
      const fixedBlocks = blocks.map((b: Message) => ensureMeta(b as any)) as Message[];
      return ensureMeta({ ...(parsed as any), blocks: fixedBlocks }) as FormattedMessage;
    }

    return ensureMeta(parsed as any) as FormattedMessage;
  } catch (err) {
    console.error(" Formatter error — falling back to text:", err);
    return ensureMeta({ type: "text", content: reply } as any) as TextMessage;
  }
}