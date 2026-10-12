const format = (value) => {
  if (Array.isArray(value)) return `[${value.map(format).join(', ')}]`;
  if (value && typeof value === 'object') return JSON.stringify(value);
  return typeof value === 'number' ? String(Number(value.toFixed(4))) : String(value);
};

export default function VariableTable({ vars = {} }) {
  const entries = Object.entries(vars);
  if (!entries.length) return <p className="rounded-xl p-3 text-sm" style={{ color: 'var(--muted)', background: 'rgba(0,0,0,0.18)' }}>Variables appear as the algorithm runs.</p>;
  return (
    <div className="overflow-x-auto rounded-xl" style={{ background: 'rgba(0,0,0,0.18)' }}>
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Current algorithm variables</caption>
        <tbody>
          {entries.map(([name, value]) => (
            <tr key={name} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <th scope="row" className="px-3 py-1.5 font-mono font-normal" style={{ color: 'var(--muted)' }}>{name}</th>
              <td className="px-3 py-1.5 text-right font-mono">{format(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
