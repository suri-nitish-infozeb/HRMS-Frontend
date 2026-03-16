import { useState, useEffect, useCallback } from 'react';
import { Calculator, Briefcase, BarChart2 } from 'lucide-react';
import { useAppSelector } from '../../hooks';
import { CopilotInput, QuickActions } from '../../components';
import type { QuickActionItem } from '../../components';
import ChatCanvas from '../../components/Ai/ChatCanvas';
import { fetchAIResponse } from '../../components/Ai/api';
import type { Message } from '../../components/Ai/types';
import styles from './HomeAI.module.css';

// TODO: replace with user.email once email is added to User type in store
const HARDCODED_EMAIL = 'gaurav@infozeb.com';

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    icon: <Calculator size={24} strokeWidth={1.8} />,
    title: 'Calculate Average Pay',
    description: 'Average pay for the manufacturing department across all roles.',
    actionLabel: 'Calculate Now',
    onAction: () => { },
  },
  {
    icon: <Briefcase size={24} strokeWidth={1.8} />,
    title: 'New Job Openings',
    description: 'View and manage 5 new open positions for this quarter.',
    actionLabel: 'View Openings',
    onAction: () => { },
  },
  {
    icon: <BarChart2 size={24} strokeWidth={1.8} />,
    title: 'Workhours Comparison',
    description: 'Compare weekly workhours between departments.',
    actionLabel: 'Compare Data',
    onAction: () => { },
  },
];

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
  // const [response, setResponse] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  

const handleAsk = useCallback(async (value: string) => {
  if (!value.trim()) return;

  const userMessage: Message = {
    id: crypto.randomUUID(),
    role: "user",
    type: "text",
    content: value,
    timestamp: new Date().toISOString(),
  };

  setHasAsked(true);
  setMessages((prev) => [...prev, userMessage]);
  setIsLoading(true);

  const aiResponse = await fetchAIResponse({
    username: user.name,
    email: HARDCODED_EMAIL,
    prompt: value,
  });

  setMessages((prev) => [
    ...prev,
    { ...aiResponse, id: crypto.randomUUID(), role: "assistant", timestamp: new Date().toISOString() },
  ]);

  setIsLoading(false);
}, [user.name]);

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
            <ChatCanvas messages={messages} isLoading={isLoading} />
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