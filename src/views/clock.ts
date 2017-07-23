import { IMatrix, Store, getRGBA, PicoPixel } from 'led-matrix';

const store = new Store(32, 16);

export function runner(): IMatrix {
  const date = new Date().toString();

  store.fillScreen(null);
  store.write(3, 2, date.substring(4, 10), PicoPixel, 1, getRGBA('#007EE5'));
  store.write(3, 8, date.substring(16, 24), PicoPixel, 1, getRGBA('#50E3C2'));
  return store.matrix;
}
