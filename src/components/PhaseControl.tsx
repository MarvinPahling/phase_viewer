interface PhaseControlProps {
  phaseDifference: number;
  onPhaseChange: (value: number) => void;
  frequency: number;
}

export function PhaseControl({ phaseDifference, onPhaseChange, frequency }: PhaseControlProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
      <div className="mb-6">
        <label htmlFor="phase-slider" className="block text-lg mb-2 text-white">
          Phase Difference:{' '}
          <span className="text-neon-green font-bold text-xl">{phaseDifference}°</span>
        </label>
        <input
          id="phase-slider"
          type="range"
          min="0"
          max="180"
          step="1"
          value={phaseDifference}
          onChange={(e) => onPhaseChange(Number(e.target.value))}
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
          <span>0°</span>
          <span>90°</span>
          <span>180°</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div className="flex justify-between p-3 bg-black/30 rounded border-l-4 border-neon-green">
          <span className="text-gray-400 font-medium">Frequency:</span>
          <span className="text-neon-green font-bold">{frequency} Hz</span>
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
