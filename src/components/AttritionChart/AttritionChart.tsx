import styles from './AttritionChart.module.css';

export interface AttritionData {
  title: string;
  subtitle?: string;
  categories: string[];
  values: number[];
  unit?: string;
}

interface AttritionChartProps {
  data: AttritionData;
}

function AttritionChart({ data }: AttritionChartProps) {
  const { title, subtitle, categories, values, unit = '%' } = data;
  const maxVal = Math.max(...values, 1);
  const barGap = 8;
  const barWidth = 32;
  const chartHeight = 200;
  const labelHeight = 24;
  const totalBarWidth = barWidth + barGap;
  const chartWidth = categories.length * totalBarWidth - barGap;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={styles.chartWrap}>
        <svg
          viewBox={`0 0 ${chartWidth + 48} ${chartHeight + labelHeight + 24}`}
          className={styles.svg}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="attritionBarFill" x1="0" x2="0" y1="1" y2="0">
              <stop offset="0%" stopColor="rgba(107, 158, 255, 0.5)" />
              <stop offset="100%" stopColor="#6b9eff" />
            </linearGradient>
          </defs>
          {values.map((val, i) => {
            const x = 24 + i * totalBarWidth;
            const barH = (val / maxVal) * chartHeight;
            const y = chartHeight - barH;
            return (
              <g key={categories[i]}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="4"
                  fill="url(#attritionBarFill)"
                  className={styles.bar}
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + labelHeight}
                  className={styles.axisLabel}
                  textAnchor="middle"
                >
                  {categories[i]}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  className={styles.valueLabel}
                  textAnchor="middle"
                >
                  {val}{unit}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default AttritionChart;
