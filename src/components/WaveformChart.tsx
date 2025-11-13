import type { Data, Layout } from 'plotly.js';
import Plot from 'react-plotly.js';
import type { PlotlyConfig, PlotlyLayout, PlotlyTrace } from '../hooks/usePlotlyConfig';

interface WaveformChartProps {
  traces: PlotlyTrace[];
  layout: PlotlyLayout;
  config: PlotlyConfig;
}

export function WaveformChart({ traces, layout, config }: WaveformChartProps) {
  return (
    <div className="bg-black/50 border border-white/10 rounded-lg p-4 mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <Plot
        data={traces as unknown as Data[]}
        layout={layout as unknown as Partial<Layout>}
        config={config}
        style={{ width: '100%', height: '600px' }}
      />
    </div>
  );
}
