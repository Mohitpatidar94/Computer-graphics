/** Draw a small deterministic picture on a canvas by sampling a coarse pixel grid. */
export function drawSampled(ctx, x, y, width, height, cols, rows) {
  if (cols < 1 || rows < 1 || width <= 0 || height <= 0) return;
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const nx = (col / Math.max(cols - 1, 1)) * 2 - 1;
      const ny = (row / Math.max(rows - 1, 1)) * 2 - 1;
      const sky = ny < -0.1;
      const sun = (nx + 0.38) ** 2 + (ny + 0.55) ** 2 < 0.055;
      const hill = ny > 0.18 + 0.28 * Math.sin(nx * 4);
      ctx.fillStyle = sun ? '#FFB454' : sky ? `hsl(${205 + Math.round((1 - Math.abs(nx)) * 22)} 68% ${35 + (1 - Math.abs(ny)) * 20}%)` : hill ? '#34D399' : '#155E75';
      ctx.fillRect(x + col * cellWidth, y + row * cellHeight, Math.ceil(cellWidth), Math.ceil(cellHeight));
    }
  }
}
