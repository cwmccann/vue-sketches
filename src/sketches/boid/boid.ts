import p5 from 'p5';
import { getRandomNumber } from '@/utils';
const Vector = p5.Vector;

export enum BoidType {
  Predator,
  Prey,
}

export class Boid {
  public position: p5.Vector;
  public velocity: p5.Vector;
  public acceleration: p5.Vector;
  public type: BoidType;
  public sight: number = 50;

  private maxForce: number;
  private maxSpeed: number;

  constructor(x: number, y: number, type: BoidType = BoidType.Prey) {
    this.position = new Vector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(getRandomNumber(2, 4));
    this.acceleration = new Vector();
    this.maxForce = 0.5;
    this.maxSpeed = 4;
    this.type = type;
  }

  isPrey() {
    return this.type === BoidType.Prey;
  }

  isPredator() {
    return this.type === BoidType.Predator;
  }

  flock(localFlockmates: Boid[], localObstacles: p5.Vector[]) {
    const weights = {
      alignment: 1,
      cohesion: 1,
      separation: 1,
      obstacles: 2,
    };

    //Clear out the acceleration vector
    this.acceleration.mult(0);

    const alignment = this.align(localFlockmates).mult(weights.alignment);
    const cohesion = this.cohesion(localFlockmates).mult(weights.cohesion);
    const separation = this.separation(localFlockmates).mult(weights.separation);
    const obstacleAvoidance = this.avoid(localObstacles).mult(weights.obstacles);

    // Add a bit of noise
    // const noise = Vector.random2D().mult(weights.noise);

    // this.acceleration.add(noise);
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
    this.acceleration.add(obstacleAvoidance);
    this.acceleration.limit(this.maxForce);
  }

  avoid(localObstacles: p5.Vector[]) {
    if (localObstacles.length === 0) {
      return new Vector();
    }

    const forceVector = new Vector();

    for (const obstacle of localObstacles) {
      const d = Vector.dist(this.position, obstacle);
      const diff = Vector.sub(this.position, obstacle);
      diff.div(d * d);
      forceVector.add(diff);
    }
    return forceVector.normalize();
  }

  separation(localFlockmates: Boid[]) {
    if (localFlockmates.length === 0) {
      return new Vector();
    }
    const forceVector = new Vector();

    for (const other of localFlockmates) {
      const d = Vector.dist(this.position, other.position);
      const diff = Vector.sub(this.position, other.position);
      diff.div(d * d);
      forceVector.add(diff);
    }
    return forceVector.normalize();
  }

  align(localFlockmates: Boid[]) {
    if (localFlockmates.length === 0 || this.isPredator()) {
      return new Vector();
    }

    const avgVelocity = new Vector();
    let count = 0;
    for (const other of localFlockmates) {
      if (other.isPredator()) {
        continue;
      }
      count++;
      avgVelocity.add(other.velocity);
    }
    if (count === 0) {
      return new Vector();
    }

    avgVelocity.div(count);

    return avgVelocity.normalize();
  }

  cohesion(localFlockmates: Boid[]) {
    if (localFlockmates.length === 0 || this.isPredator()) {
      return new Vector();
    }

    const avgPosition = new Vector();
    let count = 0;
    for (const other of localFlockmates) {
      if (other.isPredator()) {
        continue;
      }

      count++;
      avgPosition.add(other.position);
    }

    if (count === 0) {
      return new Vector();
    }
    avgPosition.div(count);

    // Calculate the desired velocity to get the boid to the center of the flock
    const desired = Vector.sub(avgPosition, this.position);
    desired.setMag(this.maxSpeed);

    // Calculate the steering force
    const steer = Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);

    return steer;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
  }

  show(p: p5) {
    const base = 8;
    const height = 16;

    // Calculate the points of the triangle
    const p1 = p.createVector(-base / 2, -height / 2);
    const p2 = p.createVector(0, height / 2);
    const p3 = p.createVector(base / 2, -height / 2);

    // Calculate the angle of the velocity vector
    const angle = this.velocity.heading() - p.PI / 2;

    p.push();

    // Translate to the position of the boid and rotate by the angle of the velocity
    p.translate(this.position.x, this.position.y);
    p.rotate(angle);

    const boidColor = this.type === BoidType.Predator ? p.color(0, 0, 255) : p.color(170, 26, 237);
    p.strokeWeight(2);
    p.stroke;
    p.fill(boidColor);
    p.triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

    p.pop();
  }
}
