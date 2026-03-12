/**
 * API project item. Backend may return id/name; we normalize to id/label for UI.
 */
export interface ProjectApiItem {
  id: string;
  name?: string;
  label?: string;
}
