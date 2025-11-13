/**
 * Generates quadrature encoder waveform data for NXT motor visualization
 * Based on: https://trivox.tripod.com/lego-nxt-motor-input-output.html
 * - 180 pulses per rotation
 * - ~45:55 duty cycle (simulated as 0.45)
 * - Adjustable phase offset between channels
 */

/**
 * Generates a square wave with specified parameters
 * @param {number} duration - Total time duration in seconds
 * @param {number} frequency - Frequency in Hz
 * @param {number} dutyCycle - Duty cycle (0 to 1)
 * @param {number} phaseOffset - Phase offset in degrees (0 to 360)
 * @param {number} samplesPerPeriod - Number of samples per period
 * @returns {Object} - {time: [], signal: [], edges: []}
 */
function generateSquareWave(duration, frequency, dutyCycle = 0.45, phaseOffset = 0, samplesPerPeriod = 20) {
  const period = 1 / frequency;
  const totalSamples = Math.floor(duration / period) * samplesPerPeriod;
  const dt = duration / totalSamples;

  const time = [];
  const signal = [];
  const edges = [];

  let prevValue = null;

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
        value: value
      });
    }

    prevValue = value;
  }

  return { time, signal, edges };
}

/**
 * Generates waveform data for both encoder channels (A and B)
 * @param {number} phaseDifference - Phase difference in degrees (0 to 180)
 * @returns {Object} - Contains data for both channels and combined edges
 */
export function generateEncoderWaveforms(phaseDifference = 90) {
  const duration = 0.1; // 100ms of data
  const frequency = 1800; // 180 pulses per rotation at 10 rotations/sec
  const dutyCycle = 0.45; // 45% duty cycle (realistic NXT motor)

  // Generate Channel A (reference)
  const channelA = generateSquareWave(duration, frequency, dutyCycle, 0);

  // Generate Channel B with phase offset
  const channelB = generateSquareWave(duration, frequency, dutyCycle, phaseDifference);

  // Combine all edges and sort by time
  const allEdges = [
    ...channelA.edges.map(e => ({ ...e, channel: 'A' })),
    ...channelB.edges.map(e => ({ ...e, channel: 'B' }))
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
    duration
  };
}

/**
 * Formats time in microseconds for display
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
export function formatTimeDelta(seconds) {
  if (seconds === null) return 'N/A';
  const microseconds = seconds * 1e6;
  return `${microseconds.toFixed(2)} μs`;
}
