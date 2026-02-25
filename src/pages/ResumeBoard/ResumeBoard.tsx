import { ResumeBoard as ResumeBoardComponent } from '../../components/ResumeBoard';
import type { ResumeBoardData } from '../../types/resumeBoard';
import resumeBoardData from '../../data/resumeBoard.json';
import styles from './ResumeBoard.module.css';

const data = resumeBoardData as ResumeBoardData;

function ResumeBoardPage() {
  return (
    <div className={styles.wrapper}>
      <ResumeBoardComponent data={data} />
    </div>
  );
}

export default ResumeBoardPage;
