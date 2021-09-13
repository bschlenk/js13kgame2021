import { GoalPlanet, Planet, UniversePlayer } from '../universe';
import { AsteroidSpawner } from '../universe/asteroid_spawner';
import { buildUniverse, planetWithDebris, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 300, y: 500, orientation: Math.PI * 1.5 }),
    new AsteroidSpawner({
      x: 500,
      y: -100,
      spawnRatePerSecond: 0.9,
      spawnDirection: Math.PI * -1.7,
      spawnSpeed: 0.2,
    }),
    new AsteroidSpawner({
      x: 300,
      y: 900,
      spawnRatePerSecond: 1,
      spawnDirection: Math.PI * 1.7,
      spawnSpeed: 0.2,
    }),
    new Planet({ x: 300, y: 500, texture: '#0dd', rotationSpeed: 1 }),
    ...planetWithDebris(
      { x: 500, y: 300, texture: '#aa0', rotationSpeed: 1 },
      10,
    ),
    ...planetWithDebris(
      { x: 700, y: 500, texture: '#b1d', rotationSpeed: 1 },
      10,
    ),
    ...planetWithDebris(
      { x: 900, y: 300, texture: '#dd1', rotationSpeed: 1 },
      10,
    ),
    new GoalPlanet({ x: 1100, y: 500, texture: '#333', goalTexture: '#ff0' }),
  ],
}));
