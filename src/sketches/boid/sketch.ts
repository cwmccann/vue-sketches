import p5 from 'p5';
import { throttle } from 'lodash';
import { defineStore } from 'pinia';
import { Boid, BoidType } from './boid';
import { SpatialBuckets } from './grid';
import type { SketchState } from '@/components/SketchState';

const Vector = p5.Vector;
const obstacleRadius = 10;

export const useSketchStore = defineStore('boid', {
  state: (): SketchState => ({
    props: {
      backgroundColor: {
        label: 'Background Color',
        type: 'color',
        value: '#000',
      },
      toggle: {
        label: 'Toggle',
        type: 'boolean',
        value: true,
      },
      slider: {
        label: 'Slider',
        type: 'slider',
        value: 10,
        min: 0,
        max: 100,
      },
      fps: {
        type: 'status',
        label: 'FPS',
        value: '0',
      },
      boids: {
        type: 'status',
        label: 'Boids',
        value: '0',
      },
      obstacles: {
        type: 'status',
        label: 'Obstacles',
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
  const store = useSketchStore();
  const obstacles: p5.Vector[] = [];

  let width = p.windowWidth;
  let height = p.windowHeight;
  let boids: Boid[] = [];
  let grid = new SpatialBuckets(width, height, 50);
  let mouseDown = false;
  let count = 0;

  const setFps = throttle((fps: number) => store.setFps(fps), 500);

  const addObstacle = (obstacle: p5.Vector) => {
    obstacles.push(obstacle);
    grid.addObstacle(obstacle);
    store.props.obstacles.value = `${obstacles.length}`;
  };

  const addBoid = (boid: Boid) => {
    boids.push(boid);
    grid.addBoid(boid);
    store.props.boids.value = `${boids.length}`;
  };

  const createDefaultObstacles = () => {
    for (let x = 0; x < width; x += obstacleRadius * 1.5) {
      addObstacle(new Vector(x, obstacleRadius));
      addObstacle(new Vector(x, height - obstacleRadius));
    }
    for (let y = 0; y < height; y += obstacleRadius * 1.5) {
      addObstacle(new Vector(obstacleRadius, y));
      addObstacle(new Vector(width - obstacleRadius, y));
    }
  };

  const reset = () => {
    store.clearReset();
    boids.length = 0;
    obstacles.length = 0;
    grid.clearBoids();
    grid.clearObstacles();
    createDefaultObstacles();
  };

  const resize = () => {
    width = p.width;
    height = p.height;
    grid = new SpatialBuckets(width, height, 50);

    //Todo - figure out which obstacles to keep
    obstacles.length = 0;
    createDefaultObstacles();

    boids = boids.filter((boid) => {
      if (boid.position.x > width || boid.position.y > height) {
        return false;
      }
      return true;
    });

    for (const boid of boids) {
      grid.addBoid(boid);
    }
  };

  createDefaultObstacles();

  p.draw = () => {
    if (!store.playing) {
      store.setFps(0);
      return;
    }
    if (store.resetFlag) {
      reset();
    }

    if (width !== p.width || height !== p.height) {
      resize();
    }

    p.background(store.backgroundColor());
    setFps(p.frameRate());

    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      if (mouseDown && count % 2 === 0) {
        if (p.keyIsDown(p.CONTROL)) {
          addBoid(new Boid(p.mouseX, p.mouseY, BoidType.Predator));
        } else if (p.keyIsDown(p.SHIFT)) {
          console.log('Adding obstacle');
          addObstacle(new Vector(p.mouseX, p.mouseY));
        } else {
          addBoid(new Boid(p.mouseX, p.mouseY));
        }
      }
    }

    p.background(store.backgroundColor());
    //Update the grid
    grid.clearBoids();
    for (const boid of boids) {
      grid.addBoid(boid);
    }

    for (let i = boids.length - 1; i >= 0; i--) {
      const boid = boids[i];
      const [localFlockmates, localObstacles] = grid.getCloseBy(boid);
      boid.flock(localFlockmates, localObstacles);

      boid.update();
      if (boid.position.x < 0) boid.position.x = width;
      else if (boid.position.x > width) boid.position.x = 0;

      if (boid.position.y < 0) boid.position.y = height;
      else if (boid.position.y > height) boid.position.y = 0;

      boid.show(p);
    }

    //Draw the obstacles
    for (const obstacle of obstacles) {
      p.fill(255, 0, 0);
      p.circle(obstacle.x, obstacle.y, obstacleRadius);
    }
  };

  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      mouseDown = true;
      count = 0;
    }
  };

  p.mouseReleased = () => {
    mouseDown = false;
  };
};

export default {
  sketch,
  useStore: useSketchStore,
};
