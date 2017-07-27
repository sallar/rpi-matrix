import { IMatrix, Store, Color, PicoPixel } from 'led-matrix';
import * as cache from 'memory-cache';
import * as fetch from 'isomorphic-fetch';
import * as _ from 'lodash';
import { delay } from '../utils';

const getPixels = require('get-pixels');
const ms = require('ms');

const url =
  'http://api.wunderground.com/api/5e062647a3fbbb9a/conditions/q/FI/Espoo.json';
const store = new Store(32, 16);
let __image: number[][] = [];
let __sequence = 0;

function readImage(): Promise<any> {
  return new Promise((resolve, reject) => {
    getPixels(
      'data:image/png;base64,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',
      (err: any, pixels: any) => {
        if (err) {
          return reject(err);
        }
        __image = _.chunk(pixels.data, 4);
        resolve();
      }
    );
  });
}

function drawSequence(store: Store, sequence = 0) {
  const width = 16;
  const height = 16;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const dx = sequence * width + y;
      // const dy = 0 * height + x;
      const dy = x;
      const [r, g, b, a]: number[] = __image[dy * 512 + dx];
      if (r || g || b) {
        store.drawPixel(x, y, Color.rgba(r, g, b, a));
      }
    }
  }
}

function setWeather() {
  return fetch(url).then(res => res.json()).then((res: any) => {
    console.log('setting weather', res);
    cache.put('weather', res.current_observation, ms('10m'));
  });
}

export async function setup(): Promise<void> {
  setWeather();
  setInterval(setWeather, ms('5m'));
  await readImage();
}

export async function loop(): Promise<IMatrix> {
  const date = new Date().toString().substring(16, 21);
  const weather = cache.get('weather');

  store.fillScreen(null);

  drawSequence(store, __sequence++);
  if (__sequence >= 32) {
    __sequence = 0;
  }

  store.write(15, 2, date, PicoPixel, 1, Color.hex('#f9c00c'));

  if (weather) {
    store.write(18, 8, weather.feelslike_c, PicoPixel, 1, Color.hex('#5CAB7D'));
  }

  await delay(200);

  return store.matrix;
}
