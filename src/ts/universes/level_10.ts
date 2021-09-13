import { GoalPlanet, Planet, UniversePlayer } from '../universe';
import { AsteroidSpawner } from '../universe/asteroid_spawner';
import { buildUniverse, planetWithDebris, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 300, y: 500, orientation: Math.PI * 1.5 }),
    new AsteroidSpawner({
      x: 400,
      y: 900,
      spawnRatePerSecond: 2,
      spawnDirection: Math.PI * 1.7,
      spawnSpeed: 0.6,
    }),
    new Planet({ x: 300, y: 200, texture: '#beb', rotationSpeed: 1 }),
    ...planetWithDebris(
      { x: 500, y: 200, texture: '#0ff', rotationSpeed: 1 },
      50,
    ),
    new GoalPlanet({ x: 800, y: 500, texture: '#333', goalTexture: '#ff0' }),
  ],
}));
