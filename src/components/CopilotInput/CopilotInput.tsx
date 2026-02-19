import { useState } from 'react';
import { Sparkles, Mic } from 'lucide-react';
import styles from './CopilotInput.module.css';

interface CopilotInputProps {
  placeholder?: string;
  buttonLabel?: string;
  onAsk?: (value: string) => void;
  suggestedActions?: string[];
}

function CopilotInput({
  placeholder = 'What do you want to get done today?',
  buttonLabel = 'Ask Copilot',
  onAsk,
  suggestedActions = ['Try "Request sick leave" or "Show my payslips"'],
}: CopilotInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return; // Khali message na jaye

    onAsk?.(value); // Parent (HomeAI) ko value bhejo
    setValue('');   // ✅ YAHAN MAGIC HAI: Input ko turant khali kar diya
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrap}>
          <Sparkles className={styles.sparkle} size={20} strokeWidth={1.8} />
          <input
            type="text"
            className={styles.input}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label={placeholder}
          />
        </div>
        <button type="button" className={styles.micButton} aria-label="Voice input">
          <Mic size={20} strokeWidth={1.8} />
        </button>
        <button type="submit" className={styles.button} disabled={!value.trim()}>
          {buttonLabel}
        </button>
      </form>
      
      {/* Suggestions sirf tab dikhao jab value khali ho (Professional look) */}
      {value === '' && suggestedActions.length > 0 && (
        <p className={styles.suggestions}>
          {suggestedActions.map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </p>
      )}
    </div>
  );
}

export default CopilotInput;