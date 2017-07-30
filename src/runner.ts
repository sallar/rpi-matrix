import { IMatrix, Store } from 'led-matrix';
import * as clock from './views/clock';
import * as test from './views/test';

interface View {
  setup: () => Promise<any>;
  teardown?: () => Promise<any>;
  loop: () => IMatrix;
  fps: number;
}

const views: View[] = [clock, test];
let __currentView = 0;
let __currentLoop: any;

// Noop
type IRenderer = (data: IMatrix) => void;
let __render: IRenderer = () => {};

// Create Store
const store = new Store(32, 16);

export function setRenderer(fn: IRenderer) {
  __render = fn;
}

export function start() {
  const view = views[__currentView];
  view.setup().then(() => {
    __currentLoop = setInterval(() => {
      __render(view.loop());
    }, 1000 / view.fps);
  });
}

export async function nextView() {
  const currentView = views[__currentView];
  if (currentView.teardown) {
    await currentView.teardown();
  }
  __currentView++;
  if (__currentView >= views.length) {
    __currentView = 0;
  }
  clearInterval(__currentLoop);
  start();
}
