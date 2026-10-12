export default function PseudoCode({ lines = [], active = -1 }) {
  return (
    <ol aria-label="Algorithm pseudocode" className="space-y-1 overflow-x-auto rounded-xl p-3 font-mono text-xs sm:text-sm" style={{ background: 'rgba(0,0,0,0.18)' }}>
      {lines.map((line, i) => (
        <li
          key={`${i}-${line}`}
          aria-current={active === i ? 'step' : undefined}
          className="whitespace-pre rounded px-2 py-1"
          style={{ background: active === i ? 'color-mix(in srgb, var(--accent) 22%, transparent)' : 'transparent', color: active === i ? 'var(--text)' : 'var(--muted)' }}
        >
          <span className="mr-3 inline-block w-5 text-right opacity-60">{i + 1}</span>{line}
        </li>
      ))}
    </ol>
  );
}
