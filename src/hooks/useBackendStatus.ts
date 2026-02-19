import { useState, useEffect, useCallback } from 'react';
import { checkBackendHealth, isBackendConfigured } from '../services/api';

const POLL_INTERVAL_MS = 30_000;

export interface BackendStatus {
  configured: boolean;
  connected: boolean | null;
  loading: boolean;
  error: string | null;
  check: () => Promise<void>;
}

export function useBackendStatus(): BackendStatus {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    if (!isBackendConfigured) {
      setConnected(null);
      setLoading(false);
      setError('VITE_API_URL not set in .env');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await checkBackendHealth();
    setConnected(result.connected);
    setError(result.error ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    check();
    const id = setInterval(check, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [check]);

  return {
    configured: isBackendConfigured,
    connected,
    loading,
    error,
    check,
  };
}
