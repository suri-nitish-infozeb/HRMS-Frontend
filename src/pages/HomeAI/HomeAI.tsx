import { useState, useEffect, useCallback } from 'react';
import { AzureOpenAI } from "openai";
import type { EChartsOption } from 'echarts';
import { Calculator, Briefcase, BarChart2 } from 'lucide-react';
import { useAppSelector } from '../../hooks';
import { CopilotInput, QuickActions, Loader } from '../../components';
import AnalyticsChart from '../../components/AnalyticsChart/AnalyticsChart';
import type { QuickActionItem } from '../../components';
import employeesData from '../../data/employeeAttrition.json';
import styles from './HomeAI.module.css';

interface AIResponse {
  summary: string;
  chartOption: EChartsOption;
  tableConfig?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  { icon: <Calculator size={24} />, title: 'Calculate Average Pay', description: 'Average pay for manufacturing.', actionLabel: 'Calculate Now', onAction: () => { } },
  { icon: <Briefcase size={24} />, title: 'New Job Openings', description: 'View 5 new positions.', actionLabel: 'View Openings', onAction: () => { } },
  { icon: <BarChart2 size={24} />, title: 'Workhours Comparison', description: 'Compare weekly workhours.', actionLabel: 'Compare Data', onAction: () => { } },
];

function HomeAI() {
  const user = useAppSelector((state) => state.user);
  const [displayText, setDisplayText] = useState('');
  const [hasAsked, setHasAsked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const handleAsk = useCallback(async (value: string) => {
    if (!value.trim()) return;

    console.log("⌨️ [User Input]:", value); 
    setHasAsked(true);
    setIsLoading(true);

    try {
      const client = new AzureOpenAI({
        endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '',
        apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY || '',
        apiVersion: import.meta.env.VITE_AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
        dangerouslyAllowBrowser: true
      });

      const systemMessage = {
        role: "system" as const,
        content: `You are an Advanced HR Intelligence System. Data: ${JSON.stringify(employeesData)}

        STRICT OPERATIONAL RULES:
        1. DEEP DIVE ANALYSIS: Look for burnout or efficiency.
        2. ECHARTS CONFIG: Return valid ECharts object with dark-friendly colors.
        3. SUMMARY FIELD: Return a 2-line "AI Insight" as a STRING only.
        
        Return ONLY JSON:
        {
          "summary": "Insight text...",
          "chartOption": { ... },
          "tableConfig": { "headers": [], "rows": [[]] }
        }`
      };

      const messages = [
        systemMessage,
        ...chatHistory.map(msg => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content
        })),
        { role: "user" as const, content: value }
      ];

      console.log("🚀 [AI Request]: Sending Payload...", messages); 

      const response = await client.chat.completions.create({
        model: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT,
        messages: messages,
        temperature: 0,
        response_format: { type: "json_object" }
      });

      const rawContent = response.choices[0].message?.content || "{}";
      console.log("📥 [AI Raw Response]:", rawContent); 

      const result = JSON.parse(rawContent) as AIResponse;
      console.log("📊 [Parsed AI Data]:", result); 

      setAiData(result);
      setChatHistory(prev => [
        ...prev.slice(-2),
        { role: "user", content: value },
        { role: "assistant", content: JSON.stringify(result) }
      ]);
    } catch (error) {
      console.error(" [AI Error]:", error); 
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory]);

  useEffect(() => {
    setDisplayText(`Good Afternoon, ${user.name.split(' ')[0]}!`);
  }, [user.name]);

  return (
    <div className={`${styles.page} ${hasAsked ? styles.pageResults : ''}`}>
      <div className={styles.centerBlock}>
        {!hasAsked && <h1 className={styles.greeting}>{displayText}</h1>}
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
              <Loader message="Analyzing HR Data Patterns..." />
            ) : (
              <div className={styles.aiResultWrapper}>
                
                {aiData?.summary && (
                  <div className={styles.summaryBox}>
                    <p>
                      {typeof aiData.summary === 'string'
                        ? aiData.summary
                        : "Data processed. Check visualization below."}
                    </p>
                  </div>
                )}

                {aiData?.chartOption && (
                  <div className={styles.chartContainer}>
                    <AnalyticsChart options={aiData.chartOption} />
                  </div>
                )}

                {/* {aiData?.tableConfig && aiData.tableConfig.headers && (
                  <div className={styles.tableWrapper}>
                    <table className={styles.reportTable}>
                      <thead>
                        <tr>
                          {aiData.tableConfig.headers?.map((h, i) => (
                            <th key={`header-${i}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {aiData.tableConfig.rows && aiData.tableConfig.rows.length > 0 ? (
                          aiData.tableConfig.rows.map((row, i) => (
                            <tr key={`row-${i}`}>
                              {row.map((cell, j) => (
                                <td key={`cell-${i}-${j}`}>{cell}</td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={aiData.tableConfig.headers?.length || 1}>No data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )} 
                */}

              </div>
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