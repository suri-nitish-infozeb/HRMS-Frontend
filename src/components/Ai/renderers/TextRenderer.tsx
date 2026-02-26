import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { TextMessage } from "../types";
import styles from "./TextRenderer.module.css";

interface Props {
  message: TextMessage;
}

function TextRenderer({ message }: Props) {
  const content = message.content?.trim() ?? "";

  return (
    <div className={styles.container}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
          ol: ({ children }) => <ol className={styles.orderedList}>{children}</ol>,
          ul: ({ children }) => <ul className={styles.unorderedList}>{children}</ul>,
          li: ({ children }) => <li className={styles.listItem}>{children}</li>,
          a: ({ children, ...props }) => (
            <a {...props} className={styles.link} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default TextRenderer;