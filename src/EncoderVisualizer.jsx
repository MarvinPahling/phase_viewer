import { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { generateEncoderWaveforms, formatTimeDelta } from './waveformGenerator';
import './EncoderVisualizer.css';

function EncoderVisualizer() {
  const [phaseDifference, setPhaseDifference] = useState(90);

  // Generate waveform data based on phase difference
  const waveformData = useMemo(() => {
    return generateEncoderWaveforms(phaseDifference);
  }, [phaseDifference]);

  // Prepare Plotly traces
  const traces = [
    {
      x: waveformData.channelA.time,
      y: waveformData.channelA.signal.map(v => v + 2), // Offset by 2 for visual separation
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
    }
  ];

  // Calculate time range for 5 cycles
  const cycleDuration = 1 / waveformData.frequency;
  const fiveCyclesDuration = 5 * cycleDuration;

  // Create vertical lines at edge transitions
  const edgeShapes = waveformData.edges
    .filter(edge => edge.time <= fiveCyclesDuration * 2) // Show edges in visible range
    .map(edge => ({
      type: 'line',
      x0: edge.time,
      x1: edge.time,
      y0: -1,
      y1: 4,
      line: {
        color: edge.channel === 'A' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 165, 0, 0.3)',
        width: 1,
        dash: 'dot'
      }
    }));

  // Create arrows between consecutive edges showing deltas
  const deltaShapes = waveformData.edges
    .filter(edge => edge.delta !== null && edge.time <= fiveCyclesDuration * 2)
    .slice(0, 40) // Limit to avoid too much clutter
    .map((edge, idx) => {
      const prevEdge = waveformData.edges[waveformData.edges.indexOf(edge) - 1];
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
          width: 2
        },
        arrowhead: 2,
        arrowsize: 1.5,
        arrowwidth: 2,
        arrowcolor: edge.channel === 'A' ? '#00ff00' : '#ffa500'
      };
    }).filter(shape => shape !== null);

  // Create annotations for delta values
  const annotations = waveformData.edges
    .filter(edge => edge.delta !== null && edge.time <= fiveCyclesDuration * 2)
    .slice(0, 40)
    .map((edge, idx) => {
      const prevEdge = waveformData.edges[waveformData.edges.indexOf(edge) - 1];
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
        borderpad: 2
      };
    }).filter(ann => ann !== null);

  // Plotly layout configuration
  const layout = {
    title: {
      text: 'NXT Motor Quadrature Encoder Signals',
      font: { color: '#ffffff', size: 20 }
    },
    xaxis: {
      title: 'Time (seconds)',
      gridcolor: '#444444',
      color: '#ffffff',
      zeroline: false,
      range: [0, fiveCyclesDuration] // Initial zoom to 5 cycles
    },
    yaxis: {
      title: 'Signal Level',
      gridcolor: '#444444',
      color: '#ffffff',
      range: [-1, 4],
      tickvals: [0.5, 2.5],
      ticktext: ['Channel B', 'Channel A'],
      zeroline: false
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
      borderwidth: 1
    },
    shapes: [...edgeShapes, ...deltaShapes],
    annotations: annotations,
    hovermode: 'x unified',
    margin: { t: 80, b: 60, l: 80, r: 40 }
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d']
  };

  return (
    <div className="encoder-visualizer">
      <div className="header">
        <h1>NXT Motor Quadrature Encoder Visualizer</h1>
        <p className="description">
          Simulates the two-channel encoder output with 180 pulses per rotation and ~45% duty cycle
        </p>
      </div>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="phase-slider">
            Phase Difference: <span className="value">{phaseDifference}°</span>
          </label>
          <input
            id="phase-slider"
            type="range"
            min="0"
            max="180"
            step="1"
            value={phaseDifference}
            onChange={(e) => setPhaseDifference(Number(e.target.value))}
            className="slider"
          />
          <div className="slider-labels">
            <span>0°</span>
            <span>90°</span>
            <span>180°</span>
          </div>
        </div>

        <div className="info">
          <div className="info-item">
            <span className="label">Frequency:</span>
            <span className="value">{waveformData.frequency} Hz</span>
          </div>
          <div className="info-item">
            <span className="label">Pulses/Rotation:</span>
            <span className="value">180</span>
          </div>
          <div className="info-item">
            <span className="label">Duty Cycle:</span>
            <span className="value">~45%</span>
          </div>
        </div>
      </div>

      <div className="plot-container">
        <Plot
          data={traces}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '600px' }}
        />
      </div>

      <div className="legend-info">
        <p>
          <strong>Edge Deltas:</strong> Time differences between consecutive edges are shown
          as colored lines with annotations. Vertical dotted lines mark each edge transition.
        </p>
        <p>
          <strong>Phase Difference:</strong> Adjust the slider to change the phase offset between
          Channel A and Channel B. Ideal value is 90° (quadrature), but NXT motors typically show
          slightly less than 180° separation.
        </p>
      </div>

      <div className="edge-table">
        <h3>Edge Transitions (First 10)</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Time</th>
              <th>Channel</th>
              <th>Type</th>
              <th>Delta from Previous</th>
            </tr>
          </thead>
          <tbody>
            {waveformData.edges.slice(0, 10).map((edge, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{(edge.time * 1e6).toFixed(2)} μs</td>
                <td style={{ color: edge.channel === 'A' ? '#00ff00' : '#ffa500' }}>
                  {edge.channel}
                </td>
                <td>{edge.type === 'rising' ? '↑ Rising' : '↓ Falling'}</td>
                <td>{edge.delta ? formatTimeDelta(edge.delta) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EncoderVisualizer;
