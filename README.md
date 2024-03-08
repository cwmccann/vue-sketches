# vue-sketches

An environment to write P5 sketches using a Vue framework. I've been playing around with P5 on and off for a while and one thing I always liked doing is tweaking the parameters of the sketches to see how it changes things.

Vue is new to me, so I thought I'd combine the two to make a UI framework to display the sketches. Right now I just have two sketches, boids and a sample one. I wanted to be able to switch between them.

Another, technology I wanted to learn a bit is tailwind, so I brought that in for the css. I'm not so sure it's the best choice but I'm still playing around.

## Sketch Documentation

- [Boids](src/sketches/boid/boid.md)
- [Sample](src/sketches/sample/sample.md)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Design

The initial skeleton project was created using:

```
npm create vue@latest
```

I chose to add Typescript, Vue Router, and Pinia for state management.


## Roadmap

- Port over more sketches I've done
- Add Help documentation for each sketch
- Setup CI / CD pipeline to deploy on commit
- Add a better color picker
