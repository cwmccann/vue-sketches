import p5 from 'p5';
import { throttle } from 'lodash';
import { defineStore } from 'pinia';
import type { SketchState } from '@/components/SketchState';

export const useSketchStore = defineStore('sample', {
  state: (): SketchState => ({
    props: {
      backgroundColor: {
        type: 'color',
        value: '#000',
      },
      ballColor: {
        type: 'color',
        value: '#f00',
      },
      xSpeed: {
        label: 'X Speed',
        type: 'slider',
        value: 10,
        min: 0,
        max: 100,
      },
      ySpeed: {
        label: 'Y Speed',
        type: 'slider',
        value: 10,
        min: 0,
        max: 100,
      },
      fps: {
        type: 'status',
        label: 'FPS2',
        value: '0',
      },
    },
    playing: true,
    resetFlag: false,
  }),
  actions: {
    setBackgroundColor(color: string) {
      this.props.backgroundColor.value = color;
    },
    backgroundColor() {
      return this.props.backgroundColor.value as string;
    },
    setBallColor(color: string) {
      this.props.ballColor.value = color;
    },
    ballColor() {
      return this.props.ballColor.value as string;
    },
    xSpeed() {
      return this.props.xSpeed.value as number;
    },
    ySpeed() {
      return this.props.ySpeed.value as number;
    },
    togglePlaying() {
      this.playing = !this.playing;
    },
    setFps(fps: number) {
      this.props.fps.value = `${Math.round(fps)}`;
    },
    resetSketch() {
      this.resetFlag = true;
    },
    clearReset() {
      this.resetFlag = false;
    },
  },
});

export const sketch = (p: p5) => {
  let x: number = 0;
  let y: number = 0;
  let xSpeed: number = 0;
  let ySpeed: number = 0;
  const store = useSketchStore();
  const setFps = throttle((fps: number) => store.setFps(fps), 500);

  const mapSpeed = (speed: number): number => {
    return p.map(speed, 0, 100, 0, 20);
  }

  const reset = () => {
    store.clearReset();
    x = p.width / 2;
    y = p.height / 2;

    xSpeed = mapSpeed(store.xSpeed());
    ySpeed = mapSpeed(store.ySpeed());
  };
  reset();

  p.draw = () => {
    if (!store.playing) {
      store.setFps(0);
      return;
    }
    if (store.resetFlag) {
      reset();
    }

    p.background(store.backgroundColor());
    setFps(p.frameRate());

    const xDir = xSpeed > 0 ? 1 : -1;
    const yDir = ySpeed > 0 ? 1 : -1;
    xSpeed = mapSpeed(store.xSpeed()) * xDir;
    ySpeed = mapSpeed(store.ySpeed()) * yDir;

    x = x + xSpeed;
    y = y + ySpeed;

    if (x > p.width || x < 0) {
      xSpeed = xSpeed * -1;
    }
    if (y > p.height || y < 0) {
      ySpeed = ySpeed * -1;
    }
    p.fill(store.ballColor());
    p.ellipse(x, y, 24, 24);
  };
};

export default {
  sketch,
  useStore: useSketchStore,
};
