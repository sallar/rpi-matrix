import { createStore, Color, TomThumb } from 'matrix-display-store';
import * as mqtt from 'mqtt';

const store = createStore(32, 16);
const ms = require('ms');

let __client: mqtt.MqttClient;
let __latestData: any;
const isBrowser = typeof window !== 'undefined';

export async function setup(): Promise<void> {
  return new Promise((resolve, reject) => {
    __client = mqtt.connect({
      host: 'postman.cloudmqtt.com',
      port: isBrowser ? 32868 : 12868,
      username: 'sudgusta',
      password: 'IqF7ek_iC5lD',
      protocol: isBrowser ? 'wss' : 'mqtt'
    });
    __client.subscribe('telemetry', err => {
      if (err) {
        reject(err);
      } else {
        __client.on('message', (topic, message) => {
          __latestData = message.toString();
          resolve();
        });
      }
    });
  });
}

export async function teardown(): Promise<void> {
  return new Promise(resolve => {
    __client.end(false, () => {
      resolve();
    });
  });
}

export function loop() {
  store.fillScreen(null);

  if (!__latestData) {
    store.matrix;
  }

  const [, temperature] = __latestData.match(/([0-9\.]+)C/)!;
  const [, humidity] = __latestData.match(/([0-9]+)%/)!;

  store.write(15, 2, temperature, TomThumb, 1, Color.rgba(0, 255, 0));
  store.write(28, 2, '°', TomThumb, 1, Color.rgba(255, 255, 255));

  store.write(15, 9, humidity, TomThumb, 1, Color.rgba(0, 255, 255));
  store.write(23, 9, '%', TomThumb, 1, Color.rgba(255, 255, 255));

  store.drawBitmap(
    1,
    2,
    [
      0x00,
      0x00,
      0x39,
      0xc0,
      0x7f,
      0xe0,
      0xff,
      0xf0,
      0xff,
      0xf0,
      0xff,
      0xf0,
      0x7f,
      0xe0,
      0x3f,
      0xc0,
      0x1f,
      0x80,
      0x0f,
      0x00,
      0x06,
      0x00,
      0x00,
      0x00
    ],
    12,
    12,
    Color.hex('#F26C6D')
  );

  return store.matrix;
}

export const meta = {
  name: 'Temperature',
  fps: 1
};
