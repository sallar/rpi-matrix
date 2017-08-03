import { createStore, Color, Tiny, TomThumb } from 'led-matrix';
import { delay } from '../utils';

const store = createStore(32, 16);
const fetch = require('graphql-fetch')(
  'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
);
const query = `
{
  stop(id: "HSL:2314223") {
    stoptimesForServiceDate(date: "20170804") {
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

interface StopTime {
  name: string;
  headsign: string;
  date: string;
  epoch: number;
}
let __stopTimes: StopTime[] = [];

function getStopTimes(stop: any) {
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
  const stops = __stopTimes.filter(stop => stop.epoch > now).slice(0, 3);
  return stops.map(stop => ({
    name: (stop.name.match(/^([0-9NT ]+)\b/g) || ['ERR'])[0].trim(),
    time: stop.date.substr(16, 5)
  }));
}

export function setup(): Promise<undefined> {
  // return fetch(query).then((res: any) => {
  //   __stopTimes = getStopTimes(res.data.stop);
  // });
  return Promise.resolve(undefined);
}

export function loop() {
  store.fillScreen(null);

  // const stops = getTopThreeStops();
  // console.log(stops);
  const stops = JSON.parse(
    `[{"name":"132NT","time":"04:59"},{"name":"132","time":"05:24"},{"name":"31","time":"05:42"}]`
  );

  stops.forEach((stop: any, i: number) => {
    const { name, time } = stop;
    store.write(0, i * 4, name, Tiny, 1, Color.hex('#ffffff'));
    store.write(14, i * 4, time, Tiny, 1, Color.hex('#ffffff'));
  });

  return store.matrix;
}

export const fps = 0.05;
