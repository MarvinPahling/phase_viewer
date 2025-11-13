import type { Direction } from '../types/encoder';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (value: number) => void;
  frequency: number;
  direction: Direction;
}

function getDirectionLabel(direction: Direction): string {
  switch (direction) {
    case 'forward':
      return '→ Forward';
    case 'reverse':
      return '← Reverse';
    case 'stopped':
      return '⊗ Stopped';
  }
}

function getDirectionColor(direction: Direction): string {
  switch (direction) {
    case 'forward':
      return 'text-neon-green';
    case 'reverse':
      return 'text-neon-orange';
    case 'stopped':
      return 'text-gray-400';
  }
}

export function SpeedControl({ speed, onSpeedChange, frequency, direction }: SpeedControlProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
      <div className="mb-6">
        <label htmlFor="speed-slider" className="block text-lg mb-2 text-white">
          Motor Speed:{' '}
          <span className="text-neon-green font-bold text-xl">{speed.toFixed(1)}</span>
          <span className="text-gray-400 text-base ml-1">rot/s</span>
        </label>
        <input
          id="speed-slider"
          type="range"
          min="-7"
          max="7"
          step="0.1"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full h-2 rounded bg-gradient-to-r from-dark-tertiary to-gray-600 appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-green
            [&::-webkit-slider-thumb]:shadow-neon [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
            [&::-webkit-slider-thumb]:hover:shadow-neon-strong [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-neon-green [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:shadow-neon [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-200
            [&::-moz-range-thumb]:hover:shadow-neon-strong [&::-moz-range-thumb]:hover:scale-110"
        />
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>← -7</span>
          <span>0</span>
          <span>7 →</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
        <div className="flex justify-between p-3 bg-black/30 rounded border-l-4 border-neon-green">
          <span className="text-gray-400 font-medium">Direction:</span>
          <span className={`font-bold ${getDirectionColor(direction)}`}>
            {getDirectionLabel(direction)}
          </span>
        </div>
        <div className="flex justify-between p-3 bg-black/30 rounded border-l-4 border-neon-green">
          <span className="text-gray-400 font-medium">Frequency:</span>
          <span className="text-neon-green font-bold">{frequency.toFixed(0)} Hz</span>
        </div>
        <div className="flex justify-between p-3 bg-black/30 rounded border-l-4 border-neon-green">
          <span className="text-gray-400 font-medium">Pulses/Rotation:</span>
          <span className="text-neon-green font-bold">180</span>
        </div>
        <div className="flex justify-between p-3 bg-black/30 rounded border-l-4 border-neon-green">
          <span className="text-gray-400 font-medium">Duty Cycle:</span>
          <span className="text-neon-green font-bold">~45%</span>
        </div>
      </div>
    </div>
  );
}
