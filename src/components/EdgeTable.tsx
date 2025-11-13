import type { EdgeWithChannel } from '../types/encoder';
import { formatTimeDelta } from '../hooks/useEncoderWaveforms';

interface EdgeTableProps {
  edges: EdgeWithChannel[];
}

export function EdgeTable({ edges }: EdgeTableProps) {
  return (
    <div className="bg-black/30 border border-white/10 rounded-lg p-6 mt-8 overflow-x-auto">
      <h3 className="mt-0 mb-4 text-neon-green text-2xl [text-shadow:0_0_8px_rgba(0,255,0,0.4)]">
        Edge Transitions (First 10)
      </h3>
      <table className="w-full border-collapse font-mono text-[0.95rem]">
        <thead className="bg-neon-green/10 border-b-2 border-neon-green">
          <tr>
            <th className="p-3 text-left text-neon-green font-semibold uppercase text-[0.85rem] tracking-wide">
              #
            </th>
            <th className="p-3 text-left text-neon-green font-semibold uppercase text-[0.85rem] tracking-wide">
              Time
            </th>
            <th className="p-3 text-left text-neon-green font-semibold uppercase text-[0.85rem] tracking-wide">
              Channel
            </th>
            <th className="p-3 text-left text-neon-green font-semibold uppercase text-[0.85rem] tracking-wide">
              Type
            </th>
            <th className="p-3 text-left text-neon-green font-semibold uppercase text-[0.85rem] tracking-wide">
              Delta from Previous
            </th>
          </tr>
        </thead>
        <tbody>
          {edges.slice(0, 10).map((edge, idx) => (
            <tr
              key={idx}
              className="border-b border-white/10 transition-colors hover:bg-white/5"
            >
              <td className="p-3 text-gray-400 font-bold">{idx + 1}</td>
              <td className="p-3 text-gray-300">
                {(edge.time * 1e6).toFixed(2)} μs
              </td>
              <td
                className="p-3 font-bold"
                style={{ color: edge.channel === 'A' ? '#00ff00' : '#ffa500' }}
              >
                {edge.channel}
              </td>
              <td className="p-3 text-gray-300">
                {edge.type === 'rising' ? '↑ Rising' : '↓ Falling'}
              </td>
              <td className="p-3 text-gray-300">
                {edge.delta ? formatTimeDelta(edge.delta) : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
