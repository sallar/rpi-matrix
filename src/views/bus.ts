import { createStore, Color, OrgDot, Classic } from 'led-matrix';
import { delay } from '../utils';

const store = createStore(32, 16);
const ms = require('ms');
const fetch = require('graphql-fetch')(
  'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
);

interface StopTime {
  name: string;
  headsign: string;
  date: string;
  epoch: number;
}
let __updateTimer: any;
let __stopTimes: StopTime[] = [];

function formatStopTimes(stop: any) {
  return (stop.stoptimesForServiceDate as any[])
    .reduce((result, route) => {
      return [
        ...result,
        ...(route.stoptimes as any[]).map(time => {
          const epoch = (time.serviceDay + time.scheduledArrival) * 1000;
          return {
            headsign: route.pattern.headsign,
            name: route.pattern.name,
            date: new Date(epoch).toString(),
            epoch
          };
        })
      ];
    }, [])
    .sort((a: any, b: any) => a.epoch - b.epoch);
}

function getTopThreeStops() {
  const now = new Date().getTime();
  const stops = __stopTimes.filter(stop => stop.epoch > now).slice(0, 2);
  return stops.map(stop => ({
    name: (stop.name.match(/^([0-9]+)/g) || ['ERR'])[0].trim(),
    time: stop.date.substr(16, 5),
    minutes: Math.floor((stop.epoch - now) / 1000 / 60)
  }));
}

function getStopTimes(): Promise<any> {
  const today = new Date().toISOString().substring(0, 10).replace(/-/g, '');
  const query = `
  {
    stop(id: "HSL:2314223") {
      stoptimesForServiceDate(date: "${today}") {
        pattern {
          name
          code
          headsign
        }
        stoptimes {
          scheduledArrival
          serviceDay
        }
      }
    }
  }
  `;
  return fetch(query).then((res: any) => {
    __stopTimes = formatStopTimes(res.data.stop);
  });
}

export async function setup(): Promise<void> {
  await getStopTimes();
  __updateTimer = setInterval(() => getStopTimes(), ms('1h'));
}

export async function teardown(): Promise<void> {
  clearInterval(__updateTimer);
}

export function loop() {
  store.fillScreen(null);
  const stops = getTopThreeStops();

  stops.forEach((stop: any, i: number) => {
    const { name, minutes } = stop;
    const mins = (`${minutes}` as any).padStart(2, 0);
    store.write(0, i * 8, name, Classic, 1, Color.hex('#58C9B9'));
    store.write(20, i * 8, mins, Classic, 1, Color.hex('#FFFFFF'));
  });

  return store.matrix;
}

export const fps = 0.05;
