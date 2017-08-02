import { IMatrix, Store, Color, TomThumb } from 'led-matrix';
import * as cache from 'memory-cache';
import * as fetch from 'isomorphic-fetch';
import { delay } from '../utils';
import chunk = require('lodash/chunk');

const getPixels = require('get-pixels');
const ms = require('ms');
const image = require('../images/01d.png');

const url =
  'http://api.openweathermap.org/data/2.5/weather?q=Espoo,FI&APPID=146c256a087c40880291650a75386da2&units=metric';
const store = new Store(32, 16);
let __image: number[][] = [];
let __sequence = 0;
let __weatherTimer: any;

const ANIM_FRAMES = 16;
const ANIM_WIDTH = 16;
const ANIM_HEIGHT = 16;

function readImage(): Promise<any> {
  return new Promise((resolve, reject) => {
    getPixels(image, (err: any, pixels: any) => {
      if (err) {
        return reject(err);
      }
      __image = chunk(pixels.data, 4);
      resolve();
    });
  });
}

function drawSequence(store: Store, x: number, y: number, sequence = 0) {
  for (let xx = 0; xx < ANIM_WIDTH; xx++) {
    for (let yy = 0; yy < ANIM_HEIGHT; yy++) {
      const dx = sequence * ANIM_WIDTH + xx;
      const dy = yy;
      const [r, g, b, a]: number[] = __image[
        dy * (ANIM_WIDTH * ANIM_FRAMES) + dx
      ];
      if (r || g || b) {
        store.drawPixel(x + xx, y + yy, Color.rgba(r, g, b, a));
      }
    }
  }
}

function setWeather() {
  return fetch(url).then(res => res.json()).then((res: any) => {
    console.log('setting weather', res);
    cache.put('weather', res, ms('10m'));
  });
}

export async function setup(): Promise<void> {
  setWeather();
  __weatherTimer = setInterval(setWeather, ms('5m'));
  await readImage();
}

export async function teardown(): Promise<void> {
  clearInterval(__weatherTimer);
}

export function loop(): IMatrix {
  const date = new Date().toString().substring(16, 21);
  const weather = cache.get('weather');

  store.fillScreen(null);

  drawSequence(store, -1, 0, __sequence++);

  if (__sequence >= ANIM_FRAMES) {
    __sequence = 0;
  }

  store.write(15, 2, date, TomThumb, 1, Color.hex('#FFFFFF'));

  if (weather) {
    const temp = `${weather.main.temp}°`;
    store.write(15, 8, temp, TomThumb, 1, Color.rgba(0, 255, 0));
  }

  return store.matrix;
}

export const fps = 5;
