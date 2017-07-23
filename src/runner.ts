import { IMatrix, Store } from 'led-matrix';
import { font } from './fonts/5x5';

// Noop
type IRenderer = (data: IMatrix) => void;
let __render: IRenderer = () => {};

// Create Store
const store = new Store(32, 16);

export function setRenderer(fn: IRenderer) {
  __render = fn;
}

export function start() {
  store.write('Sherry', font, '#ff0000');

  setInterval(() => __render(store.matrix), 1000 / 60); // 60fps
  __render(store.matrix);
}
