import { useMemo } from 'react';
import type { Direction, EdgeInfo, EdgeWithChannel, EncoderWaveforms, WaveformData } from '../types/encoder';

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
 * Determines rotation direction based on speed
 */
function getDirection(speed: number): Direction {
  if (speed > 0) return 'forward';
  if (speed < 0) return 'reverse';
  return 'stopped';
}

/**
 * Generates encoder waveforms based on motor speed (rotations per second)
 * Positive speed = forward rotation (Channel A leads Channel B)
 * Negative speed = reverse rotation (Channel B leads Channel A)
 */
function generateEncoderWaveforms(speed: number = 0): EncoderWaveforms {
  const duration = 0.1; // 100ms of data
  const pulsesPerRotation = 180; // NXT motor encoder specification
  const dutyCycle = 0.45; // 45% duty cycle (realistic NXT motor)
  const quadraturePhase = 90; // 90° phase offset for quadrature encoding

  // Calculate frequency based on speed
  const frequency = Math.abs(speed) * pulsesPerRotation;
  const direction = getDirection(speed);

  // For zero speed, generate flat lines
  if (frequency === 0) {
    const time = [0, duration];
    const signal = [0, 0];
    const channelA: WaveformData = { time, signal, edges: [] };
    const channelB: WaveformData = { time, signal, edges: [] };

    return {
      channelA,
      channelB,
      edges: [],
      frequency,
      duration,
      speed,
      direction,
    };
  }

  // Determine phase relationship based on direction
  // Forward: Channel A leads (B is delayed by 90°)
  // Reverse: Channel B leads (A is delayed by 90°)
  const phaseA = direction === 'forward' ? 0 : quadraturePhase;
  const phaseB = direction === 'forward' ? quadraturePhase : 0;

  // Generate Channel A and Channel B
  const channelA = generateSquareWave(duration, frequency, dutyCycle, phaseA);
  const channelB = generateSquareWave(duration, frequency, dutyCycle, phaseB);

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
    speed,
    direction,
  };
}

/**
 * Hook to generate encoder waveforms based on motor speed
 * Memoizes the result to avoid unnecessary recalculations
 */
export function useEncoderWaveforms(speed: number): EncoderWaveforms {
  return useMemo(() => generateEncoderWaveforms(speed), [speed]);
}

/**
 * Formats time in microseconds for display
 */
export function formatTimeDelta(seconds: number | null): string {
  if (seconds === null) return 'N/A';
  const microseconds = seconds * 1e6;
  return `${microseconds.toFixed(2)} μs`;
}
