import { IMatrix } from 'led-matrix';
import { setRenderer, start } from '../runner';

// Create the canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Create the simulator
const LedMatrix = require('node-rpi-rgb-led-matrix');
const led = new LedMatrix(16);

// Render
function render(data: IMatrix) {
  for (let i = 0; i < data.length; i += 1) {
    const dy = Math.floor(i / 32);
    const dx = i - dy * 32;
    const { on, color } = data[i];
    if (on && color) {
      led.setPixel(dx, dy, color.r, color.g, color.b);
    } else {
      led.setPixel(dx, dy, 0, 0, 0);
    }
  }
}

// Run
setRenderer(render);
start();
