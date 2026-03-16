import { useState, type CSSProperties } from "react";
import type { GridMessage, GridCard } from "../types";
import styles from "./GridRenderer.module.css";

interface Props {
  message: GridMessage;
}

const ACCENTS = [
  {
    gradient: "linear-gradient(135deg, var(--color-chart-line), var(--color-primary))",
    text: "var(--color-primary)",
  },
  {
    gradient: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
    text: "var(--color-primary)",
  },
  {
    gradient: "linear-gradient(135deg, var(--color-primary-hover), var(--color-chart-line))",
    text: "var(--color-primary)",
  },
];

function parseSubtitle(subtitle: string): { key: string; val: string }[] {
  return subtitle
    .split("|")
    .map((part) => {
      const trimmed = part.trim();
      const colonIdx = trimmed.indexOf(":");

      if (colonIdx === -1) {
        return { key: "", val: trimmed };
      }

      return {
        key: trimmed.slice(0, colonIdx).trim(),
        val: trimmed.slice(colonIdx + 1).trim(),
      };
    })
    .filter((row) => row.val);
}

function Card({
  card,
  index,
}: {
  card: GridCard & { link?: string };
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const accent = ACCENTS[index % ACCENTS.length];

  const subtitleRows = card.subtitle ? parseSubtitle(card.subtitle) : [];
  const hasTrend = card.trend && card.trend !== "neutral" && card.trendValue;
  const trendIcon = card.trend === "up" ? "↑" : "↓";

  const trendColor =
    card.trend === "up" ? "var(--color-success)" : "var(--color-danger)";
  const trendBg =
    card.trend === "up"
      ? "var(--color-success-bg)"
      : "var(--color-danger-bg)";

  const cardLink = card.link;

  return (
    <div
      className={`${styles.card} ${expanded ? styles.cardExpanded : ""}`}
      style={
        {
          "--accent-gradient": accent.gradient,
          "--accent-text": accent.text,
        } as CSSProperties
      }
      onClick={() => setExpanded((prev) => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setExpanded((prev) => !prev);
        }
      }}
    >
      <div className={styles.topBar} />

      <div className={styles.cardHead}>
        {card.icon && (
          <div className={styles.iconWrap}>
            <span className={styles.icon}>{card.icon}</span>
          </div>
        )}

        <div className={styles.cardMeta}>
          <span className={styles.cardTitle}>{card.title}</span>

          {hasTrend && (
            <span
              className={styles.badge}
              style={{
                color: trendColor,
                background: trendBg,
              }}
            >
              {trendIcon} {card.trendValue}
            </span>
          )}
        </div>

        <span className={styles.chevron}>{expanded ? "▲" : "▼"}</span>
      </div>

      <div className={styles.valueRow}>
        <span className={styles.value}>{card.value}</span>
      </div>

      {!expanded && subtitleRows.length > 0 && (
        <div className={styles.previewRows}>
          {subtitleRows.slice(0, 2).map((r, i) => (
            <div key={i} className={styles.previewRow}>
              {r.key && <span className={styles.previewKey}>{r.key}:</span>}
              <span className={styles.previewVal}>{r.val}</span>
            </div>
          ))}
          {subtitleRows.length > 2 && (
            <span className={styles.moreHint}>
              +{subtitleRows.length - 2} more fields
            </span>
          )}
        </div>
      )}

      {expanded && (
        <div
          className={styles.expandedBody}
          onClick={(e) => e.stopPropagation()}
        >
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
              onClick={(e) => e.stopPropagation()}
            >
              <span>
                {cardLink.includes("sharepoint")
                  ? "📊 Open Excel Tracker"
                  : "🔗 View Career Page"}
              </span>
              <span className={styles.linkArrow}>→</span>
            </a>
          )}

          <button
            className={styles.collapseBtn}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(false);
            }}
          >
            ▲ Collapse
          </button>
        </div>
      )}

      {!expanded && <div className={styles.tapHint}>Tap to see all details</div>}
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

      <div className={styles.grid} style={{ "--cols": cols } as CSSProperties}>
        {message.cards.map((card, i) => (
          <Card key={i} card={card as GridCard & { link?: string }} index={i} />
        ))}
      </div>
    </div>
  );
}

export default GridRenderer;