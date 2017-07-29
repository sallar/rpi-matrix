import { IMatrix, Store, Color, TomThumb } from 'led-matrix';
import * as cache from 'memory-cache';
import * as fetch from 'isomorphic-fetch';
import * as _ from 'lodash';
import { delay } from '../utils';

const getPixels = require('get-pixels');
const ms = require('ms');
const image = require('../images/partly-cloudy-day.png');

const url =
  'http://api.wunderground.com/api/5e062647a3fbbb9a/conditions/q/FI/Espoo.json';
const store = new Store(32, 16);
let __image: number[][] = [];
let __sequence = 0;

function readImage(): Promise<any> {
  return new Promise((resolve, reject) => {
    getPixels(image, (err: any, pixels: any) => {
      if (err) {
        return reject(err);
      }
      __image = _.chunk(pixels.data, 4);
      resolve();
    });
  });
}

function drawSequence(store: Store, x: number, y: number, sequence = 0) {
  const width = 16;
  const height = 16;
  for (let xx = 0; xx < width; xx++) {
    for (let yy = 0; yy < height; yy++) {
      const dx = sequence * width + xx;
      const dy = yy;
      const [r, g, b, a]: number[] = __image[dy * 512 + dx];
      if (r || g || b) {
        store.drawPixel(x + xx, y + yy, Color.rgba(r, g, b, a));
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

  drawSequence(store, -1, 0, __sequence++);
  if (__sequence >= 32) {
    __sequence = 0;
  }

  store.write(15, 2, date, TomThumb, 1, Color.hex('#FFFFFF'));

  if (weather) {
    store.write(18, 8, weather.feelslike_c, TomThumb, 1, Color.rgba(0, 255, 0));
  }

  await delay(200);

  return store.matrix;
}
