import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface AnalyticsChartProps {
  options: EChartsOption | null | undefined;
  height?: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ options, height = '450px' }) => {

  const chartRef = useRef<ReactECharts>(null);

  const isValidConfig = !!(
    options &&
    typeof options === 'object' &&
    'series' in options &&
    Array.isArray(options.series) &&
    options.series.length > 0
  );

  useEffect(() => {
    console.log(" [Chart Component] Received Options:", options);

    if (!options) {
      console.warn(" [Chart Component] Options are null or undefined.");
    } else if (!isValidConfig) {
      console.error(" [Chart Component] Invalid Config: 'series' property is missing in options!");
    } else {
      console.log("s [Chart Component] Config is valid. Rendering chart...");
    }
  }, [options, isValidConfig]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        console.log("📏 [Chart Component] Resizing chart instance...");
        chartRef.current.getEchartsInstance().resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isValidConfig) {
    return (
      <div style={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '20px',
        border: '1px dashed #333',
        color: '#666'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>📊 Waiting for Chart Data...</p>
          {/* <small>(Check console if this stays for too long)</small> */}
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container-inner fade-in">
      <ReactECharts
        ref={chartRef}
        option={options as EChartsOption}
        style={{ height: height, width: '100%' }}
        notMerge={true}
        lazyUpdate={true}
        theme="dark"
        opts={{ renderer: 'svg' }}
        onEvents={{
          'finished': () => console.log("✨ [Chart Component] Render complete.")
        }}
      />
    </div>
  );
};

export default AnalyticsChart;