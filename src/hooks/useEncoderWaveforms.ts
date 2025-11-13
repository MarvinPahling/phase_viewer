import { useMemo } from 'react';
import type {
  EdgeInfo,
  EdgeWithChannel,
  WaveformData,
  EncoderWaveforms,
} from '../types/encoder';

/**
 * Generates a square wave with specified parameters
 */
function generateSquareWave(
  duration: number,
  frequency: number,
  dutyCycle: number = 0.45,
  phaseOffset: number = 0,
  samplesPerPeriod: number = 20
): WaveformData {
  const period = 1 / frequency;
  const totalSamples = Math.floor(duration / period) * samplesPerPeriod;
  const dt = duration / totalSamples;

  const time: number[] = [];
  const signal: number[] = [];
  const edges: EdgeInfo[] = [];

  let prevValue: number | null = null;

  for (let i = 0; i <= totalSamples; i++) {
    const t = i * dt;
    const phase = ((t * frequency * 360 + phaseOffset) % 360) / 360;
    const value = phase < dutyCycle ? 1 : 0;

    time.push(t);
    signal.push(value);

    // Detect edges (transitions)
    if (prevValue !== null && prevValue !== value) {
      edges.push({
        time: t,
        type: value === 1 ? 'rising' : 'falling',
        value: value,
      });
    }

    prevValue = value;
  }

  return { time, signal, edges };
}

/**
 * Generates encoder waveforms with the specified phase difference
 */
function generateEncoderWaveforms(phaseDifference: number = 90): EncoderWaveforms {
  const duration = 0.1; // 100ms of data
  const frequency = 1800; // 180 pulses per rotation at 10 rotations/sec
  const dutyCycle = 0.45; // 45% duty cycle (realistic NXT motor)

  // Generate Channel A (reference)
  const channelA = generateSquareWave(duration, frequency, dutyCycle, 0);

  // Generate Channel B with phase offset
  const channelB = generateSquareWave(duration, frequency, dutyCycle, phaseDifference);

  // Combine all edges and sort by time
  const allEdges: EdgeWithChannel[] = [
    ...channelA.edges.map((e) => ({ ...e, channel: 'A' as const })),
    ...channelB.edges.map((e) => ({ ...e, channel: 'B' as const })),
  ].sort((a, b) => a.time - b.time);

  // Calculate deltas between consecutive edges
  const edgesWithDeltas = allEdges.map((edge, idx) => {
    if (idx === 0) return { ...edge, delta: null };
    const delta = edge.time - allEdges[idx - 1].time;
    return { ...edge, delta };
  });

  return {
    channelA,
    channelB,
    edges: edgesWithDeltas,
    frequency,
    duration,
  };
}

/**
 * Hook to generate encoder waveforms based on phase difference
 * Memoizes the result to avoid unnecessary recalculations
 */
export function useEncoderWaveforms(phaseDifference: number): EncoderWaveforms {
  return useMemo(
    () => generateEncoderWaveforms(phaseDifference),
    [phaseDifference]
  );
}

/**
 * Formats time in microseconds for display
 */
export function formatTimeDelta(seconds: number | null): string {
  if (seconds === null) return 'N/A';
  const microseconds = seconds * 1e6;
  return `${microseconds.toFixed(2)} μs`;
}
