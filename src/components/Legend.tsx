export function Legend() {
  return (
    <div className="bg-neon-orange/10 border border-neon-orange/30 rounded-lg p-6 mt-8">
      <p className="my-3 leading-relaxed text-gray-300">
        <strong className="text-neon-orange">Edge Deltas:</strong> Time differences
        between consecutive edges are shown as colored lines with annotations. Vertical
        dotted lines mark each edge transition.
      </p>
      <p className="my-3 leading-relaxed text-gray-300">
        <strong className="text-neon-orange">Phase Difference:</strong> Adjust the
        slider to change the phase offset between Channel A and Channel B. Ideal value
        is 90° (quadrature), but NXT motors typically show slightly less than 180°
        separation.
      </p>
    </div>
  );
}
