/**
 * Type definitions for encoder waveform visualization
 */

export interface EdgeInfo {
  time: number;
  type: 'rising' | 'falling';
  value: number;
}

export interface EdgeWithChannel extends EdgeInfo {
  channel: 'A' | 'B';
  delta: number | null;
}

export interface WaveformData {
  time: number[];
  signal: number[];
  edges: EdgeInfo[];
}

export interface EncoderWaveforms {
  channelA: WaveformData;
  channelB: WaveformData;
  edges: EdgeWithChannel[];
  frequency: number;
  duration: number;
}
