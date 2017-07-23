import { IMatrix, Store, getRGBA } from 'led-matrix';
import { font } from '../fonts/5x5';

const store = new Store(32, 16);

export function runner(): IMatrix {
  const date = new Date().toString();

  store.fillScreen(null);
  store.write(`${date.substring(16, 19)}\n`, font, getRGBA('#007EE5'));
  store.write(`\n${date.substring(19, 24)}`, font, getRGBA('#9012FE'));
  return store.matrix;
}
