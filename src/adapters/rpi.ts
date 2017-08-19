import { IMatrix } from 'led-matrix';
import { setRenderer, start, nextView } from '../runner';
import * as http from 'http';

// GPIO Button
const rpio = require('rpio');
const pin = 37;
rpio.open(pin, rpio.INPUT, rpio.PULL_UP);
rpio.poll(pin, (cbpin: any) => {
  if (!rpio.read(cbpin)) {
    nextView();
  }
});

// Server responder
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    nextView();
  }
  res.statusCode = 200;
  res.end();
});

server.listen(8000);

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
