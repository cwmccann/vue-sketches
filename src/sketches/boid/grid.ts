import p5 from 'p5';
import { Boid } from './boid';

interface Bucket {
  boids: Boid[];
  obstacles: p5.Vector[];
}

export class SpatialBuckets {
  private resolution: number;
  private width: number;
  private height: number;
  public grid: Bucket[][];

  constructor(width: number, height: number, resolution: number) {
    this.resolution = resolution;
    this.width = width;
    this.height = height;

    this.grid = Array.from({ length: Math.ceil(width / resolution) }, () =>
      Array.from({ length: Math.ceil(height / resolution) }, () => ({
        boids: [],
        obstacles: [],
      }))
    );
  }

  getBucketForVector(v: p5.Vector): [number, number] {
    const x = Math.floor(v.x / this.resolution);
    const y = Math.floor(v.y / this.resolution);
    return [x, y];
  }

  addBoid(boid: Boid) {
    const [x, y] = this.getBucketForVector(boid.position);

    if (x < 0 || x >= this.grid.length || y < 0 || y >= this.grid[0].length) {
      console.log('grid', this.grid.length, this.grid[0].length);
      console.log('Out of bounds', x, y, 'Boid: ', boid.position);

      return;
    }
    this.grid[x][y].boids.push(boid);
  }

  addObstacle(obstacle: p5.Vector) {
    const [x, y] = this.getBucketForVector(obstacle);
    this.grid[x][y].obstacles.push(obstacle);
  }

  getCloseBy(boid: Boid): [Boid[], p5.Vector[]] {
    const localFlockmates: Boid[] = [];
    const obstacles: p5.Vector[] = [];

    const [x, y] = this.getBucketForVector(boid.position);
    const neighbors = this.getNeighbors(boid.position, boid.sight);

    for (const neighbor of neighbors) {
      for (const other of neighbor.boids) {
        if (other !== boid) {
          const d = p5.Vector.dist(boid.position, other.position);
          if (d < boid.sight) {
            localFlockmates.push(other);
          }
        }
      }
      for (const obstacle of neighbor.obstacles) {
        const d = p5.Vector.dist(boid.position, obstacle);
        if (d < boid.sight) {
          obstacles.push(obstacle);
        }
      }
    }

    return [localFlockmates, obstacles];
  }

  /**
   * Gets the neighbors of the given bucket
   * @param x the x coordinates of the bucket
   * @param y
   * @param sight
   * @returns
   */
  getNeighbors(v: p5.Vector, sight: number): Bucket[] {
    const neighbors: Bucket[] = [];
    const d = Math.floor(sight / this.resolution);

    const [xBucket, yBucket] = this.getBucketForVector(v);

    for (let i = -d; i <= d; i++) {
      for (let j = -d; j <= d; j++) {
        const xNeighbor = xBucket + i;
        const yNeighbor = yBucket + j;
        if (
          xNeighbor >= 0 &&
          xNeighbor < this.grid.length &&
          yNeighbor >= 0 &&
          yNeighbor < this.grid[0].length
        ) {
          neighbors.push(this.grid[xNeighbor][yNeighbor]);
        }
      }
    }
    return neighbors;
  }

  clearBoids() {
    this.grid.forEach((row) =>
      row.forEach((bucket) => {
        bucket.boids = [];
      })
    );
  }

  clearObstacles() {
    this.grid.forEach((row) =>
      row.forEach((bucket) => {
        bucket.obstacles = [];
      })
    );
  }
}
