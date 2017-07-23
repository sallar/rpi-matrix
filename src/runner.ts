import { IMatrix, Store } from 'led-matrix';
import { runner } from './views/clock';

// Noop
type IRenderer = (data: IMatrix) => void;
let __render: IRenderer = () => {};

// Create Store
const store = new Store(32, 16);

export function setRenderer(fn: IRenderer) {
  __render = fn;
}

export function start() {
  // Run programme at 60fps
  setInterval(() => {
    __render(runner());
  }, 1000 / 2);
}
