import { IMatrix, Store, PicoPixel, Color } from 'matrix-display-store';
import * as weather from './views/weather';
import * as bus from './views/bus';

export interface ViewMeta {
  fps: number;
  name: string;
}

export interface View {
  setup: () => Promise<any>;
  teardown?: () => Promise<any>;
  loop: () => IMatrix;
  meta: ViewMeta;
}

const views: View[] = [weather, bus];
let __currentView = 0;
let __currentLoop: any;

// Noop
type IRenderer = (data: IMatrix) => void;
let __render: IRenderer = () => {};

function renderLoading() {
  const store = new Store(32, 16);
  const white = Color.hex('#ffffff');
  store.drawFastHLine(3, 3, 26, white);
  store.drawFastHLine(3, 11, 26, white);
  store.write(3, 5, 'LOADING', PicoPixel, 1, white);
  return store.matrix;
}

export function setRenderer(fn: IRenderer) {
  __render = fn;
}

export function start() {
  const view = views[__currentView];
  __render(renderLoading());
  view.setup().then(() => {
    __render(view.loop());
    __currentLoop = setInterval(() => {
      __render(view.loop());
    }, 1000 / view.meta.fps);
  });
}

export async function nextView(viewIndex?: number): Promise<void> {
  const currentView = views[__currentView];
  if (currentView.teardown) {
    await currentView.teardown();
  }
  if (typeof viewIndex === 'number' && viewIndex > 0) {
    if (viewIndex > views.length - 1) {
      return;
    }
    __currentView = viewIndex;
  } else {
    __currentView++;
    if (__currentView >= views.length) {
      __currentView = 0;
    }
  }
  clearInterval(__currentLoop);
  start();
}

export const getCurrentView = () => views[__currentView].meta;
export const getViews = () => views.map(view => view.meta);
