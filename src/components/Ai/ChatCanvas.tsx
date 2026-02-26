import { useEffect, useRef } from "react";
import type { Message } from "./types";
import ChatBubble from "./ChatBubble";
import styles from "./ChatCanvas.module.css";

interface Props {
  messages: Message[];
  isLoading: boolean;
}

function TypingIndicator() {
  return (
    <div className={styles.typingRow}>
      <div className={styles.typingAvatar}>AI</div>
      <div className={styles.typingBubble}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>✦</div>
      <p className={styles.emptyTitle}>Ask me anything</p>
      <p className={styles.emptySubtitle}>
        I can show data as tables, charts, grids, links and more.
      </p>
    </div>
  );
}

function ChatCanvas({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className={styles.canvas}>
      {messages.length === 0 && !isLoading ? (
        <EmptyState />
      ) : (
        <>
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}

export default ChatCanvas;