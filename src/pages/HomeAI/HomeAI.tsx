import { useState, useEffect, useCallback } from 'react';
import { Calculator, Briefcase, BarChart2 } from 'lucide-react';
import { useAppSelector } from '../../hooks';
import { CopilotInput, QuickActions, Loader, AttritionChart } from '../../components';
import type { QuickActionItem } from '../../components';
import type { AttritionData } from '../../components';
import attritionData from '../../data/employeeAttrition.json';
import styles from './HomeAI.module.css';

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    icon: <Calculator size={24} strokeWidth={1.8} />,
    title: 'Calculate Average Pay',
    description:
      'Average pay for the manufacturing department across all roles.',
    actionLabel: 'Calculate Now',
    onAction: () => {},
  },
  {
    icon: <Briefcase size={24} strokeWidth={1.8} />,
    title: 'New Job Openings',
    description: 'View and manage 5 new open positions for this quarter.',
    actionLabel: 'View Openings',
    onAction: () => {},
  },
  {
    icon: <BarChart2 size={24} strokeWidth={1.8} />,
    title: 'Workhours Comparison',
    description: 'Compare weekly workhours between departments.',
    actionLabel: 'Compare Data',
    onAction: () => {},
  },
];

const GRAPH_LOAD_DELAY_MS = 1800;

function getGreetingPhrase(userName: string): string {
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const name = userName.split(' ')[0];
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

function HomeAI() {
  const user = useAppSelector((state) => state.user);
  const phrase1 = getGreetingPhrase(user.name);
  const [displayText, setDisplayText] = useState('');
  const [hasAsked, setHasAsked] = useState(false);
  const [graphLoaded, setGraphLoaded] = useState(false);

  const handleAsk = useCallback((value: string) => {
    if (!value.trim()) return;
    setHasAsked(true);
    setGraphLoaded(false);
  }, []);

  useEffect(() => {
    if (!hasAsked) return;
    const id = setTimeout(() => setGraphLoaded(true), GRAPH_LOAD_DELAY_MS);
    return () => clearTimeout(id);
  }, [hasAsked]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let currentPhase = PHRASE_GREETING;

    function getFullText() {
      return currentPhase === PHRASE_GREETING ? phrase1 : PHRASE_2;
    }

    function typeForward(index: number) {
      if (cancelled) return;
      const fullText = getFullText();
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        timeoutId = setTimeout(() => typeForward(index + 1), TYPE_DELAY_MS);
      } else {
        timeoutId = setTimeout(() => eraseBackward(fullText.length), PAUSE_AFTER_TYPE_MS);
      }
    }

    function eraseBackward(index: number) {
      if (cancelled) return;
      const fullText = getFullText();
      if (index > 0) {
        setDisplayText(fullText.slice(0, index));
        timeoutId = setTimeout(() => eraseBackward(index - 1), ERASE_DELAY_MS);
      } else {
        setDisplayText('');
        currentPhase = currentPhase === PHRASE_GREETING ? PHRASE_MIND : PHRASE_GREETING;
        timeoutId = setTimeout(() => typeForward(0), PAUSE_AFTER_ERASE_MS);
      }
    }

    typeForward(0);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [phrase1]);

  return (
    <div className={`${styles.page} ${hasAsked ? styles.pageResults : ''}`}>
      <div className={styles.centerBlock}>
        <h1 className={styles.greeting}>
          {displayText}
          <span className={styles.cursor} aria-hidden />
        </h1>

        {!hasAsked && (
          <>
            <CopilotInput onAsk={handleAsk} />
            <div className={styles.quickActions}>
              <QuickActions actions={QUICK_ACTIONS} />
            </div>
          </>
        )}
      </div>

      {hasAsked && (
        <>
          <div className={styles.canvas}>
            {!graphLoaded ? (
              <Loader />
            ) : (
              <AttritionChart data={attritionData as AttritionData} />
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

export default HomeAI;
