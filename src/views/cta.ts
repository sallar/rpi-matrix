import { createStore, Color, OrgDot } from "matrix-display-store";
import * as mqtt from "mqtt";

const store = createStore(32, 16);

export async function setup(): Promise<void> {}

export async function teardown(): Promise<void> {}

let __last: boolean = false;

export function loop() {
  store.fillScreen(Color.rgba(255, 255, 0));

  if (__last) {
    store.write(4, 2, "COME", OrgDot, 1, Color.rgba(0, 0, 0));
    store.write(4, 8, "FAST", OrgDot, 1, Color.rgba(0, 0, 0));
  }
  __last = !__last;

  return store.matrix;
}

export const meta = {
  name: "CTA",
  fps: 2,
};
