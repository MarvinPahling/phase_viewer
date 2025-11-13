import { useMemo } from 'react';
import type { EncoderWaveforms } from '../types/encoder';
import { formatTimeDelta } from './useEncoderWaveforms';

export interface PlotlyTrace {
  x: number[];
  y: number[];
  type: string;
  mode: string;
  name: string;
  line: {
    color: string;
    width: number;
    shape: string;
  };
}

export interface PlotlyLayout {
  title: {
    text: string;
    font: { color: string; size: number };
  };
  xaxis: {
    title: string;
    gridcolor: string;
    color: string;
    zeroline: boolean;
    range: number[];
  };
  yaxis: {
    title: string;
    gridcolor: string;
    color: string;
    range: number[];
    tickvals: number[];
    ticktext: string[];
    zeroline: boolean;
  };
  plot_bgcolor: string;
  paper_bgcolor: string;
  font: { color: string };
  showlegend: boolean;
  legend: {
    x: number;
    y: number;
    bgcolor: string;
    bordercolor: string;
    borderwidth: number;
  };
  shapes: any[];
  annotations: any[];
  hovermode: string;
  margin: { t: number; b: number; l: number; r: number };
}

export interface PlotlyConfig {
  responsive: boolean;
  displayModeBar: boolean;
  displaylogo: boolean;
  modeBarButtonsToRemove: string[];
}

/**
 * Hook to generate Plotly traces, layout, and config for encoder waveforms
 */
export function usePlotlyConfig(waveformData: EncoderWaveforms) {
  const traces = useMemo<PlotlyTrace[]>(
    () => [
      {
        x: waveformData.channelA.time,
        y: waveformData.channelA.signal.map((v) => v + 2), // Offset by 2 for visual separation
        type: 'scatter',
        mode: 'lines',
        name: 'Channel A',
        line: { color: '#00ff00', width: 2, shape: 'hv' },
      },
      {
        x: waveformData.channelB.time,
        y: waveformData.channelB.signal,
        type: 'scatter',
        mode: 'lines',
        name: 'Channel B',
        line: { color: '#ffa500', width: 2, shape: 'hv' },
      },
    ],
    [waveformData]
  );

  const layout = useMemo<PlotlyLayout>(() => {
    // Calculate time range for 5 cycles
    const cycleDuration = 1 / waveformData.frequency;
    const fiveCyclesDuration = 5 * cycleDuration;

    // Create vertical lines at edge transitions
    const edgeShapes = waveformData.edges
      .filter((edge) => edge.time <= fiveCyclesDuration * 2)
      .map((edge) => ({
        type: 'line',
        x0: edge.time,
        x1: edge.time,
        y0: -1,
        y1: 4,
        line: {
          color:
            edge.channel === 'A' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 165, 0, 0.3)',
          width: 1,
          dash: 'dot',
        },
      }));

    // Create arrows between consecutive edges showing deltas
    const deltaShapes = waveformData.edges
      .filter((edge) => edge.delta !== null && edge.time <= fiveCyclesDuration * 2)
      .slice(0, 40)
      .map((edge) => {
        const prevEdge =
          waveformData.edges[waveformData.edges.indexOf(edge) - 1];
        if (!prevEdge) return null;

        const yPos = edge.channel === 'A' ? 3.3 : -0.3;

        return {
          type: 'line',
          x0: prevEdge.time,
          x1: edge.time,
          y0: yPos,
          y1: yPos,
          line: {
            color: edge.channel === 'A' ? '#00ff00' : '#ffa500',
            width: 2,
          },
          arrowhead: 2,
          arrowsize: 1.5,
          arrowwidth: 2,
          arrowcolor: edge.channel === 'A' ? '#00ff00' : '#ffa500',
        };
      })
      .filter((shape) => shape !== null);

    // Create annotations for delta values
    const annotations = waveformData.edges
      .filter((edge) => edge.delta !== null && edge.time <= fiveCyclesDuration * 2)
      .slice(0, 40)
      .map((edge) => {
        const prevEdge =
          waveformData.edges[waveformData.edges.indexOf(edge) - 1];
        if (!prevEdge) return null;

        const midTime = (prevEdge.time + edge.time) / 2;
        const yPos = edge.channel === 'A' ? 3.6 : -0.6;

        return {
          x: midTime,
          y: yPos,
          text: formatTimeDelta(edge.delta),
          showarrow: false,
          font: { size: 9, color: '#ffffff', family: 'monospace' },
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          borderpad: 2,
        };
      })
      .filter((ann) => ann !== null);

    return {
      title: {
        text: 'NXT Motor Quadrature Encoder Signals',
        font: { color: '#ffffff', size: 20 },
      },
      xaxis: {
        title: 'Time (seconds)',
        gridcolor: '#444444',
        color: '#ffffff',
        zeroline: false,
        range: [0, fiveCyclesDuration],
      },
      yaxis: {
        title: 'Signal Level',
        gridcolor: '#444444',
        color: '#ffffff',
        range: [-1, 4],
        tickvals: [0.5, 2.5],
        ticktext: ['Channel B', 'Channel A'],
        zeroline: false,
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
      shapes: [...edgeShapes, ...deltaShapes],
      annotations: annotations,
      hovermode: 'x unified',
      margin: { t: 80, b: 60, l: 80, r: 40 },
    };
  }, [waveformData]);

  const config = useMemo<PlotlyConfig>(
    () => ({
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    }),
    []
  );

  return { traces, layout, config };
}
