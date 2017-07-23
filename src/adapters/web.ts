import { LedMatrix, IMatrix } from 'led-matrix';
import { setRenderer, start } from '../runner';

// Create the canvas
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.left = '50%';
canvas.style.top = '50%';
canvas.style.transform = 'translate(-50%, -50%)';
document.body.appendChild(canvas);
document.body.style.backgroundColor = '#222';

// Create the simulator
const led = new LedMatrix(canvas, {
  x: 32,
  y: 16,
  pixelWidth: 20,
  pixelHeight: 20
});

// Render
function render(data: IMatrix) {
  led.setData(data);
  led.render();
}

// Run
setRenderer(render);
start();
