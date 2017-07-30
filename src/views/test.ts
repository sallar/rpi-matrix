import { createStore, Color, Tiny } from 'led-matrix';
import { delay } from '../utils';

const store = createStore(32, 16);

export async function setup(): Promise<undefined> {
  return;
}

export function loop() {
  store.fillScreen(null);
  store.write(5, 4, 'SALLAR\nSHERRY', Tiny, 1, Color.hex('#ff0000'));

  return store.matrix;
}

export const fps = 5;
