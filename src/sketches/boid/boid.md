# Boid Sketch

[Boid Algorithm](https://en.wikipedia.org/wiki/Boids)

The Boid algorithm, proposed by Craig Reynolds in 1986, simulates the flocking behavior of birds. It is designed to mimic the behaviors observed in natural flocks, schools of fish, or swarms of insects through artificial life simulation. The algorithm operates on three simple rules applied to each individual (known as a boid) within the simulation:

- Separation: Each boid steers away from its close neighbors to avoid crowding and collision.
- Alignment: Boids steer towards the average heading of their neighbors, promoting the flock to move in a unified direction.
- Cohesion: Boids move towards the average position of their neighbors to maintain the cohesion of the flock.

These rules are evaluated at each step of the simulation, taking into account the positions and velocities of a boid's neighbors within a certain radius. Despite the simplicity of these rules, their combination leads to the emergence of complex and natural-looking flocking behaviors. The Boid algorithm has found applications in computer graphics, artificial intelligence, and robotics, especially in scenarios requiring the simulation of collective behavior.

## Usage

1. Clicking the mouse with create a new boid, holding the mouse button down will create a stream of them.
2. Holding the ctrl button down and pressing the mouse will create a different boid. It was going to be a predator boid to eat the others, but I haven't gotten around to that. These boids will be a different color and only apply the separation rules.
3. Holding the shift button down and pressing the mouse will create obstacles for the boids.

## Implementation

To implement the three rules, each boid needs to be compared with each other in a certain region.

**For each boid:**

- Get the boids local to it
- apply the 3 rules, separation, alignment, and cohesion. Create vectors indicating the force to be applied for each of these.
- Apply a force necessary to avoid obstacles
- For each of those forces, apply a weight to them to indicate how significant the force should be.
- Add the forces (vectors) up and then limit it to a max force amount.
- This new force is the acceleration.

**For each update cycle (frame):**

- add the boids current velocity to it's position vector
- add the acceleration vector to the velocity
- Also limit the speed to a max speed so things don't get too out of whack.

### Drawing

On each frame, the boid is drawn as a triangle that is pointing in the direction it it headed. First calculate the three points of the triangle and get the heading angle. Then use the p5 push to save the current drawing transformation, then translate the drawing from to the current boids position, and heading and just draw the triangle. Finally pop the transformation to restore the coordinate system to normal.

This allows for easy math for each boid and mean I don't need to do a bunch of matrix math manually.

### Performance Improvements

The original implementation compared the distance for each boid to every other boid to see if it was to be used to apply the rules. This quickly got out of hand when lots of boids were added and slowed the frame rate down significantly. To get around this I added a grid system.

The grid would break the space up into buckets that groups of boids can be in. Then when getting the neighbor boids I just need to figure out how many buckets to get. For large number of boids this works pretty well.

I'm sure there is more I could do to improve the performance.  Currently with ~1000 boids, it still goes at 30fps.  One obvious thing to try is using web workers (multiple threads)

## Possible Enhancements

- Make the predator boid eat the others, and chase the prey.
- More control over the parameters
- Try to make it faster

