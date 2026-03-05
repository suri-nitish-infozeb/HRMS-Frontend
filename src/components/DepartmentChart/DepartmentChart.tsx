import styles from './DepartmentChart.module.css';

const LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const VALUES = [50, 200, 550, 400, 150, 900];
const MAX = 1000;
const W = 280;
const H = 140;
const PAD = { top: 8, right: 8, bottom: 24, left: 32 };

function DepartmentChart() {
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const min = Math.min(...VALUES);
  const max = Math.max(...VALUES);
  const range = max - min || 1;
  const scaleY = (v: number) => PAD.top + chartH - ((v - min) / range) * chartH;
  const scaleX = (i: number) => PAD.left + (i / (VALUES.length - 1)) * chartW;

  const points = VALUES.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(' ');
  const areaPoints = `${PAD.left},${PAD.top + chartH} ${points} ${PAD.left + chartW},${PAD.top + chartH}`;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Department Performance</h3>
      <div className={styles.svgWrap}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="rgba(107, 158, 255, 0.35)" />
            <stop offset="100%" stopColor="rgba(107, 158, 255, 0.02)" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={String(t)}
            x1={PAD.left}
            y1={PAD.top + chartH * (1 - t)}
            x2={PAD.left + chartW}
            y2={PAD.top + chartH * (1 - t)}
            className={styles.gridLine}
          />
        ))}
        {/* Y-axis labels */}
        {[0, 250, 500, 750, 1000].map((val) => (
          <text
            key={val}
            x={PAD.left - 6}
            y={PAD.top + chartH - (val / MAX) * chartH}
            className={styles.axisLabel}
            textAnchor="end"
          >
            {val}
          </text>
        ))}
        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#chartFill)" className={styles.area} />
        {/* Line */}
        <polyline points={points} fill="none" className={styles.line} />
        {/* X-axis labels */}
        {LABELS.map((label, i) => (
          <text
            key={label}
            x={scaleX(i)}
            y={H - 4}
            className={styles.axisLabel}
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
        </svg>
      </div>
    </div>
  );
}

export default DepartmentChart;
