import { GoalPlanet, UniversePlayer } from '../universe';
import { AsteroidSpawner } from '../universe/asteroid_spawner';
import { buildUniverse, planetWithDebris, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 600, y: 50, orientation: Math.PI * 1.5 }),
    new AsteroidSpawner({
      x: 1300,
      y: -50,
      spawnRatePerSecond: 1,
      spawnDirection: Math.PI * -1.2,
      spawnSpeed: 0.5,
    }),
    new AsteroidSpawner({
      x: 0,
      y: 0,
      spawnRatePerSecond: 1,
      spawnDirection: Math.PI * 0.2,
      spawnSpeed: 0.5,
    }),
    new AsteroidSpawner({
      x: -50,
      y: 900,
      spawnRatePerSecond: 1,
      spawnDirection: Math.PI * -0.2,
      spawnSpeed: 0.5,
    }),
    new AsteroidSpawner({
      x: 1500,
      y: 900,
      spawnRatePerSecond: 0.9,
      spawnDirection: Math.PI * 1.2,
      spawnSpeed: 0.5,
    }),
    ...planetWithDebris(
      { x: 600, y: 50, texture: '#0f0', rotationSpeed: 1 },
      10,
    ),
    new GoalPlanet({
      x: 600,
      y: 600,
      texture: '#333',
      goalTexture: '#ff0',
      mass: 100,
      radius: 50,
    }),
  ],
}));
