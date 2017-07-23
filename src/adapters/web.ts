import { LedMatrix, IMatrix } from 'led-matrix';
import { setRenderer, start } from '../runner';

// Create the canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

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
