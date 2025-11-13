import { useMemo } from 'react';
import type { Data, Layout } from 'plotly.js';
import Plot from 'react-plotly.js';
import type { EdgeWithChannel } from '../types/encoder';

interface DeltaChartProps {
  edges: EdgeWithChannel[];
}

export function DeltaChart({ edges }: DeltaChartProps) {
  const { data, layout, config } = useMemo(() => {
    // Filter edges with valid deltas and limit to first 50 for clarity
    const edgesWithDeltas = edges.filter((edge) => edge.delta !== null).slice(0, 50);

    // Separate by channel for color coding
    const channelAIndices: number[] = [];
    const channelADeltas: number[] = [];
    const channelBIndices: number[] = [];
    const channelBDeltas: number[] = [];

    edgesWithDeltas.forEach((edge, idx) => {
      const deltaMs = edge.delta! * 1e6; // Convert to microseconds
      if (edge.channel === 'A') {
        channelAIndices.push(idx + 1); // 1-indexed for display
        channelADeltas.push(deltaMs);
      } else {
        channelBIndices.push(idx + 1);
        channelBDeltas.push(deltaMs);
      }
    });

    const data: Data[] = [
      {
        x: channelAIndices,
        y: channelADeltas,
        type: 'bar',
        name: 'Channel A',
        marker: {
          color: '#00ff00',
          line: {
            color: '#00ff00',
            width: 1,
          },
        },
        hovertemplate: '<b>Edge #%{x}</b><br>Delta: %{y:.2f} μs<br>Channel: A<extra></extra>',
      },
      {
        x: channelBIndices,
        y: channelBDeltas,
        type: 'bar',
        name: 'Channel B',
        marker: {
          color: '#ffa500',
          line: {
            color: '#ffa500',
            width: 1,
          },
        },
        hovertemplate: '<b>Edge #%{x}</b><br>Delta: %{y:.2f} μs<br>Channel: B<extra></extra>',
      },
    ];

    const layout: Partial<Layout> = {
      title: {
        text: 'Time Delta Between Consecutive Edges',
        font: { color: '#ffffff', size: 18 },
      },
      xaxis: {
        title: 'Edge Number',
        gridcolor: '#444444',
        color: '#ffffff',
        zeroline: false,
        dtick: 5,
      },
      yaxis: {
        title: 'Delta Time (μs)',
        gridcolor: '#444444',
        color: '#ffffff',
        zeroline: true,
        zerolinecolor: '#666666',
      },
      plot_bgcolor: '#1a1a1a',
      paper_bgcolor: '#0d0d0d',
      font: { color: '#ffffff' },
      showlegend: true,
      legend: {
        x: 0.02,
        y: 0.98,
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        bordercolor: '#ffffff',
        borderwidth: 1,
      },
      barmode: 'overlay',
      bargap: 0.1,
      hovermode: 'closest',
      margin: { t: 60, b: 60, l: 70, r: 40 },
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    };

    return { data, layout, config };
  }, [edges]);

  // Don't render if there are no edges with deltas
  if (edges.filter((e) => e.delta !== null).length === 0) {
    return (
      <div className="bg-black/30 border border-white/10 rounded-lg p-6 mb-8 text-center">
        <p className="text-gray-400 text-lg">
          No edge transitions detected. Increase motor speed to see delta chart.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/50 border border-white/10 rounded-lg p-4 mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <Plot data={data} layout={layout} config={config} style={{ width: '100%', height: '400px' }} />
    </div>
  );
}
