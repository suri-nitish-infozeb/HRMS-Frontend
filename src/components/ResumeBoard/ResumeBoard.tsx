import { useState, useCallback, useEffect } from 'react';
import ResumeBoardStructure from './ResumeBoardStructure';
import ResumeCard, { type ResumeCardItem } from './ResumeCard';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchResumesByProject, fetchAllResumes } from '../../store/slices/resumesSlice';
import type { ResumeBoardData } from '../../types/resumeBoard';
import styles from './ResumeBoard.module.css';

const DRAG_DATA_KEY = 'application/x-resume-id';

const PROJECT_ALL_OPTION = { id: 'all', label: 'All' };

interface ResumeBoardProps {
  data: ResumeBoardData;
}

function ResumeBoard({ data }: ResumeBoardProps) {
  const dispatch = useAppDispatch();
  const { list: projects, loading: projectsLoading, error: projectsError } = useAppSelector((state) => state.projects);
  const { list: resumesFromApi, loading: resumesLoading, error: resumesError, projectId: resumesProjectId } = useAppSelector((state) => state.resumes);
  const [resumes, setResumes] = useState<ResumeCardItem[]>(data.resumes);
  const [projectId, setProjectId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const projectOptionsFromApi = projects.length > 0 ? projects : data.filters.projects;
  const projectOptions = [PROJECT_ALL_OPTION, ...projectOptionsFromApi];
  const projectIdValid = projectOptions.some((p) => p.id === projectId);

  useEffect(() => {
    if (projectOptionsFromApi.length === 0) return;
    if (!projectId || !projectIdValid) {
      setProjectId(PROJECT_ALL_OPTION.id);
    }
  }, [projectOptionsFromApi.length, projectId, projectIdValid]);

  useEffect(() => {
    if (projectId === PROJECT_ALL_OPTION.id) {
      void dispatch(fetchAllResumes());
      return;
    }
    if (projectId) {
      void dispatch(fetchResumesByProject(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (projectId === PROJECT_ALL_OPTION.id) {
      if (resumesProjectId === 'all') {
        if (resumesLoading) setResumes([]);
        else setResumes(resumesFromApi);
      }
      return;
    }
    if (resumesProjectId === projectId) {
      if (resumesLoading) setResumes([]);
      else setResumes(resumesFromApi);
    }
  }, [projectId, resumesProjectId, resumesLoading, resumesFromApi]);

  const handleClearFilters = () => {
    setProjectId(PROJECT_ALL_OPTION.id);
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
          disabled={projectsLoading}
          aria-busy={projectsLoading}
          aria-invalid={!!projectsError}
        >
          {projectsLoading && projectOptionsFromApi.length === 0 ? (
            <option value="">Loading…</option>
          ) : projectsError && projectOptionsFromApi.length === 0 ? (
            <option value="">Error loading projects</option>
          ) : (
            projectOptions.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))
          )}
        </select>
        {projectsError && projectOptionsFromApi.length > 0 && (
          <span className={styles.filterError} role="alert">{projectsError}</span>
        )}
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

  const showResumesLoading = resumesLoading && resumesProjectId === projectId;
  const showResumesError = !!resumesError && resumesProjectId === projectId;

  const columnSlot = (
    <>
      {showResumesError && (
        <div className={styles.filterError} role="alert">
          {resumesError}
        </div>
      )}
      {showResumesLoading && (
        <p className={styles.loadingText}>Loading resumes…</p>
      )}
      {data.columns.map((col) => {
        const isEmpty = getResumesForColumn(col.id).length === 0;
        return (
          <div
            key={col.id}
            className={`${styles.column} ${isEmpty ? styles.columnEmpty : ''}`}
          >
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
        );
      })}
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
