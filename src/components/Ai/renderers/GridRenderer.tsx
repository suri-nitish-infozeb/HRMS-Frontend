import { useState } from "react";
import type { GridMessage, GridCard } from "../types";
import styles from "./GridRenderer.module.css";

interface Props {
  message: GridMessage;
}

const ACCENTS = [
  { gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", light: "#eef2ff", border: "#c7d2fe", text: "#4338ca", glow: "rgba(99,102,241,0.25)" },
  { gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)", light: "#faf5ff", border: "#ddd6fe", text: "#7e22ce", glow: "rgba(139,92,246,0.25)" },
  { gradient: "linear-gradient(135deg, #f43f5e, #fb7185)", light: "#fff1f2", border: "#fecdd3", text: "#be123c", glow: "rgba(244,63,94,0.25)" },
  { gradient: "linear-gradient(135deg, #f97316, #fb923c)", light: "#fff7ed", border: "#fed7aa", text: "#c2410c", glow: "rgba(249,115,22,0.25)" },
  { gradient: "linear-gradient(135deg, #10b981, #34d399)", light: "#f0fdf4", border: "#a7f3d0", text: "#065f46", glow: "rgba(16,185,129,0.25)" },
  { gradient: "linear-gradient(135deg, #3b82f6, #60a5fa)", light: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", glow: "rgba(59,130,246,0.25)" },
];

// Parse "Key: Val | Key: Val" into rows for clean display
function parseSubtitle(subtitle: string): { key: string; val: string }[] {
  return subtitle.split("|").map(part => {
    const colonIdx = part.indexOf(":");
    if (colonIdx === -1) return { key: "", val: part.trim() };
    return {
      key: part.slice(0, colonIdx).trim(),
      val: part.slice(colonIdx + 1).trim(),
    };
  }).filter(r => r.val);
}

function Card({ card, index }: { card: GridCard & { link?: string }; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const accent = ACCENTS[index % ACCENTS.length];

  const subtitleRows = card.subtitle ? parseSubtitle(card.subtitle) : [];
  const hasTrend = card.trend && card.trend !== "neutral" && card.trendValue;
  const trendIcon  = card.trend === "up" ? "↑" : "↓";
  const trendColor = card.trend === "up" ? "#16a34a" : "#dc2626";
  const cardLink   = (card as GridCard & { link?: string }).link;

  return (
    <div
      className={`${styles.card} ${expanded ? styles.cardExpanded : ""}`}
      style={{
        "--accent-gradient": accent.gradient,
        "--accent-light": accent.light,
        "--accent-border": accent.border,
        "--accent-text": accent.text,
        "--accent-glow": accent.glow,
      } as React.CSSProperties}
      onClick={() => setExpanded(e => !e)}
    >
      <div className={styles.topBar} />

      {/* Header */}
      <div className={styles.cardHead}>
        {card.icon && (
          <div className={styles.iconWrap}>
            <span className={styles.icon}>{card.icon}</span>
          </div>
        )}
        <div className={styles.cardMeta}>
          <span className={styles.cardTitle}>{card.title}</span>
          {hasTrend && (
            <span className={styles.badge} style={{ color: trendColor, background: trendColor + "18" }}>
              {trendIcon} {card.trendValue}
            </span>
          )}
        </div>
        <span className={styles.chevron}>{expanded ? "▲" : "▼"}</span>
      </div>

      {/* Main value */}
      <div className={styles.valueRow}>
        <span className={styles.value}>{card.value}</span>
      </div>

      {/* Collapsed: show first 2 subtitle rows as preview */}
      {!expanded && subtitleRows.length > 0 && (
        <div className={styles.previewRows}>
          {subtitleRows.slice(0, 2).map((r, i) => (
            <div key={i} className={styles.previewRow}>
              {r.key && <span className={styles.previewKey}>{r.key}:</span>}
              <span className={styles.previewVal}>{r.val}</span>
            </div>
          ))}
          {subtitleRows.length > 2 && (
            <span className={styles.moreHint}>+{subtitleRows.length - 2} more fields</span>
          )}
        </div>
      )}

      {/* Expanded: show ALL subtitle rows */}
      {expanded && (
        <div className={styles.expandedBody} onClick={e => e.stopPropagation()}>
          <div className={styles.divider} />
          <div className={styles.detailGrid}>
            {subtitleRows.map((r, i) => (
              <div key={i} className={styles.detailRow}>
                {r.key && <span className={styles.detailKey}>{r.key}</span>}
                <span className={styles.detailVal}>{r.val}</span>
              </div>
            ))}
          </div>
          {cardLink && (
            <a
              href={cardLink}
              target="_blank"
              rel="noreferrer"
              className={styles.linkBtn}
            >
              <span>{cardLink.includes("sharepoint") ? "📊 Open Excel Tracker" : "🔗 View Career Page"}</span>
              <span className={styles.linkArrow}>→</span>
            </a>
          )}
          <button className={styles.collapseBtn} onClick={() => setExpanded(false)}>
            ▲ Collapse
          </button>
        </div>
      )}

      {!expanded && (
        <div className={styles.tapHint}>Tap to see all details</div>
      )}
    </div>
  );
}

function GridRenderer({ message }: Props) {
  const cols = message.columns ?? 3;
  return (
    <div className={styles.wrapper}>
      {message.title && (
        <div className={styles.header}>
          <span className={styles.headerPill} />
          <h3 className={styles.title}>{message.title}</h3>
          <span className={styles.count}>{message.cards.length} items</span>
        </div>
      )}
      <div className={styles.grid} style={{ "--cols": cols } as React.CSSProperties}>
        {message.cards.map((card, i) => (
          <Card key={i} card={card as GridCard & { link?: string }} index={i} />
        ))}
      </div>
    </div>
  );
}

export default GridRenderer;