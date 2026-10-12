/** Video controller: reads the frame buffer in raster order and sends pixels to the display. */
export const VIDEO_CODE = [
  'for y = 0 .. rows-1:',
  '    for x = 0 .. cols-1:',
  '        address = y * cols + x',
  '        pixel = frameBuffer[address]',
  '        display(x, y, pixel)',
  '    horizontal retrace (go to start of next line)',
  'vertical retrace (go to top-left); repeat',
];

export function* videoSteps(cols, rows, fb) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const address = y * cols + x;
      const regs = { 'Y register': y, 'X register': x };
      yield { line: 2, x, y, address, vars: { ...regs, address: `${y} x ${cols} + ${x} = ${address}` }, note: 'Registers give the memory address.' };
      yield { line: 3, x, y, address, vars: { ...regs, address, pixel: fb[address] }, note: 'Read the pixel value from the frame buffer.' };
      yield { line: 4, x, y, address, plot: true, value: fb[address], vars: { ...regs, address, pixel: fb[address] }, note: 'Send the value to the display.' };
    }
    yield { line: 5, x: cols - 1, y, vars: { 'Y register': y + 1 }, note: 'End of line: beam returns to the left (horizontal retrace).' };
  }
  yield { line: 6, x: 0, y: 0, vars: { 'Y register': 0, 'X register': 0 }, note: 'End of frame: beam returns to the top (vertical retrace).' };
}
