import { BlockMath, InlineMath } from 'react-katex';
import MatrixBox from './MatrixBox.jsx';

export function Tex({ children, block = false }) {
  return block ? <BlockMath math={children} /> : <InlineMath math={children} />;
}

export default function MatrixView({ rows, label, hiRows = [], hiCols = [], hiCells = [] }) {
  return <MatrixBox rows={rows} label={label} hiRows={hiRows} hiCols={hiCols} hiCells={hiCells} />;
}
