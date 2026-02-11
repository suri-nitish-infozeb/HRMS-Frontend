import { Users, UserPlus, Clock } from 'lucide-react';
import { MetricCard, DepartmentChart, PendingApprovals } from '../../components';
import styles from './HomeStatic.module.css';

function HomeStatic() {
  return (
    <div className={styles.page}>
      <div className={styles.metricsRow}>
        <MetricCard
          title="Total Employees"
          icon={<Users size={20} strokeWidth={1.8} />}
          value="1,284"
          change={{ text: '12% from last month', positive: true }}
        />
        <MetricCard
          title="Active Openings"
          icon={<UserPlus size={20} strokeWidth={1.8} />}
          value="24"
          detail="4 roles added today"
        />
        <MetricCard
          title="Retention Rate"
          icon={<Clock size={20} strokeWidth={1.8} />}
          value="98.2%"
          change={{ text: '0.4% from last quarter', positive: false }}
        />
      </div>
      <div className={styles.detailRow}>
        <DepartmentChart />
        <PendingApprovals onViewAll={() => {}} />
      </div>
    </div>
  );
}

export default HomeStatic;
