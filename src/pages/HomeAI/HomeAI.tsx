import { useState, useEffect, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, ExternalLink } from 'lucide-react';
import { CopilotInput, QuickActions, Loader } from '../../components';
import AnalyticsChart from '../../components/AnalyticsChart/AnalyticsChart';
import type { QuickActionItem } from '../../components';
import styles from './HomeAI.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chartData?: any;
}

function HomeAI() {
  const [displayText, setDisplayText] = useState('');
  const [hasAsked, setHasAsked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const parseChartData = (text: string) => {
    const regex = /(\d+)\.\s+(.*?)\s+-\s+(\d+)\s+resumes/g;
    let match;
    const labels: string[] = [];
    const values: number[] = [];

    while ((match = regex.exec(text)) !== null) {
      labels.push(match[2].length > 12 ? match[2].substring(0, 10) + '..' : match[2]);
      values.push(parseInt(match[3]));
    }
    return labels.length > 0 ? {
      xAxis: { type: 'category', data: labels, axisLabel: { color: '#ccc', fontSize: 10 } },
      yAxis: { type: 'value', axisLabel: { color: '#ccc' } },
      series: [{ type: 'bar', data: values, itemStyle: { color: '#3b82f6' } }]
    } : null;
  };

  const handleAsk = useCallback(async (value: string) => {
    if (!value.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: value };
    setMessages(prev => [...prev, userMsg]);
    setHasAsked(true);
    setIsLoading(true);

    try {
      const response = await fetch('https://hrms-chat-api-e7eff0e2hvgphqh0.centralindia-01.azurewebsites.net/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: value, userName: "Gaurav", email: "gaurav@infozeb.com" })
      });

      const data = await response.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        chartData: parseChartData(data.reply)
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(" API Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const QUICK_ACTIONS: QuickActionItem[] = [
    {
      icon: <Bot size={20} />,
      title: 'Active Jobs',
      description: 'See all openings.',
      actionLabel: 'View',
      onAction: () => handleAsk("Show me all active job post and number of resumes")
    },
  ];

  useEffect(() => {
    setDisplayText(`Good Afternoon, Gaurav!`);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.chatWrapper}>
        {!hasAsked ? (
          <div className={styles.welcomeSection}>
            <h1 className={styles.greeting}>{displayText}</h1>
            <CopilotInput onAsk={handleAsk} />
            <div className={styles.quickActions}>
              <QuickActions actions={QUICK_ACTIONS} />
            </div>
          </div>
        ) : (
          <div className={styles.messageContainer}>
            <div className={styles.scrollArea} ref={scrollRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`${styles.messageRow} ${msg.role === 'user' ? styles.userRow : styles.assistantRow}`}>
                  <div className={styles.avatar}>
                    {msg.role === 'user' ? <User size={18} color="white" /> : <Bot size={18} color="#60a5fa" />}
                  </div>
                  <div className={styles.bubble}>
                    {msg.role === 'assistant' && <div className={styles.assistantTitle}>HR Assistant</div>}

                    <div className={styles.markdownContent}>
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => (
                            <a {...props} target="_blank" rel="noreferrer" className={styles.chatLink}>
                              <ExternalLink size={14} style={{marginRight: '6px'}} />
                              {props.children}
                            </a>
                          ),
                          // List items without numbers
                          li: ({ node, ...props }) => (
                            <div className={styles.interactiveListItem}>
                              <div className={styles.bulletPoint}></div>
                              <span className={styles.listText}>{props.children}</span>
                            </div>
                          ),
                          strong: ({ node, ...props }) => (
                            <span className={styles.highlightText}>{props.children}</span>
                          )
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {msg.chartData && (
                      <div className={styles.inlineChart}>
                        <AnalyticsChart options={msg.chartData} height="200px" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className={styles.assistantRow}>
                  <div className={styles.avatar}><Bot size={18} color="#60a5fa" /></div>
                  <Loader message="Thinking..." />
                </div>
              )}
            </div>
            <div className={styles.bottomInput}>
              <CopilotInput onAsk={handleAsk} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeAI;