import { GoalPlanet, Planet, UniversePlayer } from '../universe';
import { AsteroidSpawner } from '../universe/asteroid_spawner';
import { buildUniverse, planetWithDebris, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 700, y: 600, orientation: Math.PI * 1.5 }),
    new AsteroidSpawner({
      x: 300,
      y: 900,
      spawnRatePerSecond: 1,
      spawnDirection: Math.PI * -0.3,
      spawnSpeed: 0.5,
    }),
    new AsteroidSpawner({
      x: 500,
      y: -100,
      spawnRatePerSecond: 1,
      spawnDirection: Math.PI * 0.6,
      spawnSpeed: 0.5,
    }),
    new Planet({ x: 700, y: 600, texture: '#0f0', rotationSpeed: 1 }),
    ...planetWithDebris(
      { x: 500, y: 350, texture: '#ff5', rotationSpeed: 1.5 },
      10,
    ),
    new GoalPlanet({ x: 300, y: 200, texture: '#333', goalTexture: '#ff0' }),
  ],
}));
