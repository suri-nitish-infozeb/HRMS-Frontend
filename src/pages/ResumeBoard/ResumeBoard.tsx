import { useEffect } from 'react';
import { ResumeBoard as ResumeBoardComponent } from '../../components/ResumeBoard';
import { useAppDispatch } from '../../hooks';
import { fetchProjects } from '../../store/slices/projectsSlice';
import type { ResumeBoardData } from '../../types/resumeBoard';
import resumeBoardData from '../../data/resumeBoard.json';
import styles from './ResumeBoard.module.css';

const data = resumeBoardData as ResumeBoardData;

function ResumeBoardPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      <ResumeBoardComponent data={data} />
    </div>
  );
}

export default ResumeBoardPage;
