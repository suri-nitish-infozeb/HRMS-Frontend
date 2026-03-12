import { request } from '../client';
import type { ResumeCardItem } from '../../components/ResumeBoard/ResumeCard';

const COLUMN_IDS = ['new', 'under_review', 'rejected', 'short_list', 'offered'] as const;

function getArrayFromResponse(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.resumes)) return obj.resumes;
    if (Array.isArray(obj.items)) return obj.items;
    if (Array.isArray(obj.result)) return obj.result;
  }
  return [];
}

/** Maps API status to board columnId. */
function statusToColumnId(status: unknown): string {
  const s = status != null ? String(status).toLowerCase().replace(/\s+/g, '_') : '';
  if (COLUMN_IDS.includes(s as (typeof COLUMN_IDS)[number])) return s;
  const map: Record<string, string> = {
    shortlist: 'short_list',
    short_list: 'short_list',
    under_review: 'under_review',
    underreview: 'under_review',
  };
  return map[s] ?? 'new';
}

function getString(o: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = o[k];
    if (v != null) return String(v);
  }
  return '';
}

function getActions(o: Record<string, unknown>): string[] {
  const v = o.actions ?? o.action;
  if (Array.isArray(v)) return v.filter((a): a is string => typeof a === 'string');
  return ['view', 'download'];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function toResumeCardItem(item: unknown): ResumeCardItem {
  if (!item || typeof item !== 'object') {
    return {
      id: '',
      candidateName: '',
      initials: '',
      affiliation: '',
      date: '',
      columnId: 'new',
      actions: ['view', 'download'],
    };
  }
  const o = item as Record<string, unknown>;
  const candidateName = getString(o, 'candidateName', 'candidate_name', 'name', 'applicantName');
  const status = o.status ?? o.columnId ?? o.stage;
  return {
    id: getString(o, 'id', 'resumeId', 'resume_id'),
    candidateName: candidateName || 'Unknown',
    initials: getString(o, 'initials') || getInitials(candidateName),
    affiliation: getString(o, 'affiliation', 'affiliation_name', 'source', 'recruiter') || '—',
    date: getString(o, 'date', 'createdAt', 'created_at', 'appliedAt', 'applied_at') || '—',
    columnId: statusToColumnId(status),
    actions: getActions(o),
  };
}

/**
 * Fetches resumes for a project from GET /api/projects/{id}/resumes.
 * Uses the response `status` (or data object) to map each resume to a board column.
 */
export async function getResumesByProject(projectId: string): Promise<ResumeCardItem[]> {
  const data = await request<unknown>(`api/projects/${encodeURIComponent(projectId)}/resumes`);
  const list = getArrayFromResponse(data);
  return list.map(toResumeCardItem).filter((r) => r.id.length > 0);
}

/**
 * Fetches all resumes (irrespective of project) from GET /api/resumes.
 * Uses the response `status` to map each resume to a board column.
 */
export async function getAllResumes(): Promise<ResumeCardItem[]> {
  const data = await request<unknown>('api/resumes');
  const list = getArrayFromResponse(data);
  return list.map(toResumeCardItem).filter((r) => r.id.length > 0);
}
