import { request } from '../client';
import type { ResumeBoardFilterOption } from '../../types/resumeBoard';

function getArrayFromResponse(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.projects)) return obj.projects;
    if (Array.isArray(obj.items)) return obj.items;
    if (Array.isArray(obj.result)) return obj.result;
  }
  return [];
}

function getId(item: unknown): string {
  if (!item || typeof item !== 'object') return '';
  const o = item as Record<string, unknown>;
  const value = o.id ?? o.projectId ?? o.project_id;
  return value != null ? String(value) : '';
}

function getLabel(item: unknown): string {
  if (!item || typeof item !== 'object') return '';
  const o = item as Record<string, unknown>;
  const value = o.label ?? o.name ?? o.projectName ?? o.project_name ?? o.title ?? o.id ?? o.projectId ?? o.project_id;
  return value != null ? String(value) : '';
}

function toFilterOption(item: unknown): ResumeBoardFilterOption {
  const id = getId(item);
  const label = getLabel(item);
  return { id: id || 'unknown', label: label || 'Unknown' };
}

/**
 * Fetches the list of projects from api/projects.
 * Supports raw arrays or wrapped responses (e.g. { data: [] }, { projects: [] }).
 * Normalizes common property names (id, projectId, name, projectName, etc.) to { id, label }.
 */
export async function getProjects(): Promise<ResumeBoardFilterOption[]> {
  const data = await request<unknown>('api/projects');
  const list = getArrayFromResponse(data);
  return list.map(toFilterOption).filter((opt) => opt.id.length > 0);
}
