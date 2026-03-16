import { useState, useEffect, useCallback } from "react";
import { Calculator, Briefcase, BarChart2 } from "lucide-react";
import { useAppSelector } from "../../hooks";
import { CopilotInput, QuickActions } from "../../components";
import type { QuickActionItem } from "../../components";
import styles from "./AIDevelopment.module.css";
import SlotRenderer from "./SlotRenderer";
import blocksRaw from "./uidata.json";
import type { UIResponse } from "./types";

const blocks = blocksRaw as UIResponse;
const QUICK_ACTIONS: QuickActionItem[] = [
  { icon: <Calculator size={24} strokeWidth={1.8} />, title: "Calculate Average Pay", description: "Average pay for manufacturing department.", actionLabel: "Calculate Now", onAction: () => { } },
  { icon: <Briefcase size={24} strokeWidth={1.8} />, title: "New Job Openings", description: "View/manage new open positions.", actionLabel: "View Openings", onAction: () => { } },
  { icon: <BarChart2 size={24} strokeWidth={1.8} />, title: "Workhours Comparison", description: "Compare weekly workhours.", actionLabel: "Compare Data", onAction: () => { } },
];

function getGreetingPhrase(userName: string) {
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const name = userName.split(" ")[0];
  const displayName = name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : userName;
  return `${timeGreeting}, ${displayName}!`;
}

const PHRASE_GREETING = 0;
const PHRASE_MIND = 1;
const PHRASE_2 = "What's on your mind today?";
const TYPE_DELAY_MS = 80;
const ERASE_DELAY_MS = 50;
const PAUSE_AFTER_TYPE_MS = 2000;
const PAUSE_AFTER_ERASE_MS = 500;

export default function AIDevelopment() {
  const user = useAppSelector((state) => state.user);
  const phrase1 = getGreetingPhrase(user.name);

  const [displayText, setDisplayText] = useState("");
  const [hasAsked, setHasAsked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = useCallback(async (value: string) => {
    if (!value.trim()) return;

    setHasAsked(true);
    setIsLoading(true);

    try {
      setError("");

    } catch (e: any) {
      setError(e?.message || "Failed to generate UI");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let currentPhase = PHRASE_GREETING;

    const getFullText = () => (currentPhase === PHRASE_GREETING ? phrase1 : PHRASE_2);

    const typeForward = (i: number) => {
      if (cancelled) return;
      const full = getFullText();
      if (i <= full.length) {
        setDisplayText(full.slice(0, i));
        timeoutId = setTimeout(() => typeForward(i + 1), TYPE_DELAY_MS);
      } else timeoutId = setTimeout(() => eraseBackward(full.length), PAUSE_AFTER_TYPE_MS);
    };

    const eraseBackward = (i: number) => {
      if (cancelled) return;
      const full = getFullText();
      if (i > 0) {
        setDisplayText(full.slice(0, i));
        timeoutId = setTimeout(() => eraseBackward(i - 1), ERASE_DELAY_MS);
      } else {
        setDisplayText("");
        currentPhase = currentPhase === PHRASE_GREETING ? PHRASE_MIND : PHRASE_GREETING;
        timeoutId = setTimeout(() => typeForward(0), PAUSE_AFTER_ERASE_MS);
      }
    };

    typeForward(0);
    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, [phrase1]);

  return (
    <div className={`${styles.page} ${hasAsked ? styles.pageResults : ""}`}>
      <div className={styles.centerBlock}>
        <h1 className={styles.greeting}>{displayText}<span className={styles.cursor} aria-hidden /></h1>

        {!hasAsked && (
          <>
            <CopilotInput onAsk={handleAsk} />
            <div className={styles.quickActions}><QuickActions actions={QUICK_ACTIONS} /></div>
          </>
        )}
      </div>

      {hasAsked && (
        <>
          <div className={styles.canvas}>
            {isLoading ? (
              <div className={styles.loader}>Generating UI...</div>
            ) : (
              error ? (
                <div className={styles.loader}>{error}</div>
              ) : (
                <SlotRenderer blocks={blocks} />
              )
            )}
          </div>

          <div className={styles.inputBottom}>
            <CopilotInput onAsk={handleAsk} />
          </div>
        </>
      )}
    </div>
  );
}