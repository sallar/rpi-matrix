import { IMatrix } from "matrix-display-store";
import {
  setRenderer,
  start,
  nextView,
  getCurrentView,
  getViews,
  setCTA,
} from "../runner";
import throttle = require("lodash/throttle");

const polka = require("polka");
const serve = require("sirv")("public");
const rpio = require("rpio");
const cors = require("cors")();

// Http Server
let __currentFrameData: IMatrix = [];

polka()
  .use(cors)
  .use(serve)
  .get("/api/data", (_: any, res: any) => {
    res.end(
      JSON.stringify({
        data: __currentFrameData,
        currentView: getCurrentView(),
      })
    );
  })
  .get("/api/views", (_: any, res: any) => {
    res.end(JSON.stringify(getViews()));
  })
  .get("/api/view", (_: any, res: any) => {
    res.end(JSON.stringify(getCurrentView()));
  })
  .post("/api/view/:index", (req: any, res: any) => {
    nextView(Number(req.params.index));
    res.end("OK");
  })
  .post("/api/view", (_: any, res: any) => {
    nextView();
    res.end("OK");
  })
  .post("/api/cta", (_: any, res: any) => {
    setCTA();
    res.end("OK");
  })
  .listen(80, (err: any) => {
    if (err) throw err;
    console.log(`> Running on localhost:8000`);
  });

// GPIO Button
const pin = 37;
const throttledNextView = throttle(nextView, 1500);

rpio.open(pin, rpio.INPUT, rpio.PULL_UP);
rpio.poll(pin, (cbpin: any) => {
  if (!rpio.read(cbpin)) {
    throttledNextView();
  }
});

// Create the simulator
const LedMatrix = require("node-rpi-rgb-led-matrix");
const led = new LedMatrix(16);

// Render
function render(data: IMatrix) {
  __currentFrameData = data;
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
