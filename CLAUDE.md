# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite web application for visualizing LEGO NXT motor quadrature encoder signals. The visualizer simulates and displays the two-channel (A and B) encoder output with realistic parameters based on NXT motor specifications:
- 180 pulses per rotation
- ~45% duty cycle (realistic for NXT motors)
- Adjustable phase difference between channels

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production (creates single-file output via vite-plugin-singlefile)
npm run build

# Lint JavaScript/JSX files
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

### Core Components

- **EncoderVisualizer** (src/EncoderVisualizer.jsx): Main visualization component
  - Manages phase difference state via slider control
  - Generates interactive Plotly chart showing Channel A and Channel B waveforms
  - Displays edge transitions with vertical dotted lines
  - Shows time deltas between consecutive edges with arrows and annotations
  - Renders edge transition table for first 10 edges
  - Uses dark theme with color-coded channels (green for A, orange for B)

- **App** (src/App.jsx): Root application component wrapper

- **waveformGenerator** (src/waveformGenerator.js): Core signal generation logic
  - `generateSquareWave()`: Creates square wave with configurable frequency, duty cycle, and phase offset
  - `generateEncoderWaveforms()`: Generates both channels with realistic NXT parameters (1800 Hz, 45% duty cycle)
  - `formatTimeDelta()`: Formats time values in microseconds for display
  - Edge detection and delta calculation between consecutive transitions

### Key Technical Details

- **Phase Relationship**: The visualizer allows adjusting phase difference from 0° to 180°. Ideal quadrature is 90°, but NXT motors typically show slightly different values
- **Signal Frequency**: Fixed at 1800 Hz (180 pulses per rotation at 10 rotations/second)
- **Visualization Range**: Initially zooms to 5 cycles for clarity, but full data is available via Plotly pan/zoom
- **Edge Detection**: Automatically detects rising and falling edges on both channels, sorts chronologically, and calculates inter-edge timing

### Build Configuration

- Uses `vite-plugin-singlefile` to bundle everything into a single HTML file for easy distribution
- ESLint configured for React Hooks and React Refresh (fast refresh during development)
- Ignores `dist` directory in linting

### Dependencies

- **plotly.js / react-plotly.js**: Interactive charting with pan, zoom, and hover features
- **React 19**: Using modern hooks (useState, useMemo) for reactive updates
- **Vite**: Fast development server and build tool

## Working with the Visualizer

When modifying the waveform generation or visualization:
1. Signal parameters are defined in `waveformGenerator.js` - adjust frequency, duty cycle, or duration there
2. Visual appearance (colors, line styles, annotations) is controlled in the `EncoderVisualizer` component
3. Phase difference range can be adjusted via the slider min/max attributes (currently 0-180°)
4. The component uses `useMemo` to regenerate waveforms only when phase difference changes
