import { useState } from 'react';
import { useEncoderWaveforms } from '../hooks/useEncoderWaveforms';
import { usePlotlyConfig } from '../hooks/usePlotlyConfig';
import { PhaseControl } from './PhaseControl';
import { WaveformChart } from './WaveformChart';
import { Legend } from './Legend';
import { EdgeTable } from './EdgeTable';

export function EncoderVisualizer() {
  const [phaseDifference, setPhaseDifference] = useState(90);

  // Generate waveform data based on phase difference
  const waveformData = useEncoderWaveforms(phaseDifference);

  // Generate Plotly configuration
  const { traces, layout, config } = usePlotlyConfig(waveformData);

  return (
    <div className="max-w-[1400px] mx-auto p-8 bg-gradient-to-br from-dark-primary to-dark-secondary min-h-screen text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl mb-2 text-neon-green [text-shadow:0_0_10px_rgba(0,255,0,0.5)]">
          NXT Motor Quadrature Encoder Visualizer
        </h1>
        <p className="text-base text-gray-400">
          Simulates the two-channel encoder output with 180 pulses per rotation and
          ~45% duty cycle
        </p>
      </div>

      <PhaseControl
        phaseDifference={phaseDifference}
        onPhaseChange={setPhaseDifference}
        frequency={waveformData.frequency}
      />

      <WaveformChart traces={traces} layout={layout} config={config} />

      <Legend />

      <EdgeTable edges={waveformData.edges} />
    </div>
  );
}
