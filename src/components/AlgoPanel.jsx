import PseudoCode from './PseudoCode.jsx';
import VariableTable from './VariableTable.jsx';

/** Pseudo-code + live variables, both driven by the same stepper step. */
export default function AlgoPanel({ code, stepper }) {
  const st = stepper.step;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <PseudoCode lines={code} active={st ? st.line : -1} />
      <div>
        <VariableTable vars={st?.vars} />
        {st?.note && <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>{st.note}</p>}
      </div>
    </div>
  );
}
