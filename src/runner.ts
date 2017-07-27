import { IMatrix, Store } from 'led-matrix';
import { setup, loop } from './views/clock';

// Noop
type IRenderer = (data: IMatrix) => void;
let __render: IRenderer = () => {};

// Create Store
const store = new Store(32, 16);

export function setRenderer(fn: IRenderer) {
  __render = fn;
}

export function start() {
  setup().then(function __loop() {
    loop().then(matrix => __render(matrix)).then(__loop);
  });
}
