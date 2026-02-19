const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
export const isBackendConfigured = Boolean(API_BASE_URL);

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

/**
 * Check if the backend is reachable. Tries /health then base URL.
 */
export async function checkBackendHealth(): Promise<{ connected: boolean; error?: string }> {
  if (!isBackendConfigured) {
    return { connected: false, error: 'VITE_API_URL not set' };
  }

  const toTry = [`${API_BASE_URL}/health`, `${API_BASE_URL}/api/health`, API_BASE_URL];
  for (const url of toTry) {
    try {
      const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(5000) });
      if (res.ok) return { connected: true };
    } catch {
      continue;
    }
  }

  try {
    const res = await fetch(API_BASE_URL, { method: 'GET', signal: AbortSignal.timeout(5000) });
    return { connected: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return { connected: false, error: message };
  }
}

export interface JobDescriptionRow {
  id?: string | number;
  title?: string;
  department?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Fetch job descriptions from api/job-descriptions.
 * Expects JSON array or { data: array }. Returns rows for table display.
 */
export async function fetchJobDescriptions(): Promise<JobDescriptionRow[]> {
  if (!API_BASE_URL) throw new Error('VITE_API_URL not set');
  const res = await fetch(`${API_BASE_URL}/api/job-descriptions`, {
    method: 'GET',
    signal: AbortSignal.timeout(15000),
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as JobDescriptionRow[] | { data: JobDescriptionRow[] };
  if (Array.isArray(json)) return json;
  if (json && typeof json === 'object' && 'data' in json && Array.isArray(json.data)) return json.data;
  return [];
}
