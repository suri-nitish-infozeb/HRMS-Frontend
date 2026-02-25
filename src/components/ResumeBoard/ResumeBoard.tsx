import { useState, useCallback } from 'react';
import ResumeBoardStructure from './ResumeBoardStructure';
import ResumeCard, { type ResumeCardItem } from './ResumeCard';
import type { ResumeBoardData } from '../../types/resumeBoard';
import styles from './ResumeBoard.module.css';

const DRAG_DATA_KEY = 'application/x-resume-id';

interface ResumeBoardProps {
  data: ResumeBoardData;
}

function ResumeBoard({ data }: ResumeBoardProps) {
  const [resumes, setResumes] = useState<ResumeCardItem[]>(data.resumes);
  const [projectId, setProjectId] = useState(data.filters.projects[0]?.id ?? '');
  const [supplierId, setSupplierId] = useState(data.filters.suppliers[0]?.id ?? '');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const handleClearFilters = () => {
    setProjectId(data.filters.projects[0]?.id ?? '');
    setSupplierId(data.filters.suppliers[0]?.id ?? '');
    setFromDate('');
    setToDate('');
  };

  const moveResumeToColumn = useCallback((resumeId: string, targetColumnId: string) => {
    setResumes((prev) =>
      prev.map((r) => (r.id === resumeId ? { ...r, columnId: targetColumnId } : r))
    );
  }, []);

  const handleColumnDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumnId(columnId);
  }, []);

  const handleColumnDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumnId(null);
    }
  }, []);

  const handleColumnDrop = useCallback(
    (e: React.DragEvent, columnId: string) => {
      e.preventDefault();
      setDragOverColumnId(null);
      const resumeId = e.dataTransfer.getData(DRAG_DATA_KEY);
      if (resumeId) moveResumeToColumn(resumeId, columnId);
    },
    [moveResumeToColumn]
  );

  const getResumesForColumn = useCallback(
    (columnId: string): ResumeCardItem[] =>
      resumes.filter((r) => r.columnId === columnId),
    [resumes]
  );

  const filterSlot = (
    <>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="resume-project">Project</label>
        <select
          id="resume-project"
          className={styles.select}
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          {data.filters.projects.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="resume-supplier">Supplier</label>
        <select
          id="resume-supplier"
          className={styles.select}
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        >
          {data.filters.suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="resume-from">From</label>
        <input
          id="resume-from"
          type="text"
          className={styles.input}
          placeholder="dd/mm/yyyy"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="resume-to">To</label>
        <input
          id="resume-to"
          type="text"
          className={styles.input}
          placeholder="dd/mm/yyyy"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>
      <button type="button" className={styles.clearBtn} onClick={handleClearFilters}>
        Clear
      </button>
    </>
  );

  const columnSlot = (
    <>
      {data.columns.map((col) => (
        <div key={col.id} className={styles.column}>
          <h2 className={styles.columnTitle}>{col.title}</h2>
          <div
            className={`${styles.cards} ${styles.dropZone} ${dragOverColumnId === col.id ? styles.dropZoneActive : ''}`}
            onDragOver={(e) => handleColumnDragOver(e, col.id)}
            onDragLeave={handleColumnDragLeave}
            onDrop={(e) => handleColumnDrop(e, col.id)}
          >
            {getResumesForColumn(col.id).map((resume) => (
              <ResumeCard
                key={resume.id}
                item={resume}
                dragDataKey={DRAG_DATA_KEY}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );

  const footerSlot = (
    <>Showing {resumes.length} resumes • Project statuses are per-project</>
  );

  return (
    <ResumeBoardStructure
      title="Resume Board"
      filterSlot={filterSlot}
      columnSlot={columnSlot}
      footerSlot={footerSlot}
    />
  );
}

export default ResumeBoard;
