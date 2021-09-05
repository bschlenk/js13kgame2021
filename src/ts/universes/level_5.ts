import { GoalPlanet, Planet, UniversePlayer } from '../universe';
import { AsteroidSpawner } from '../universe/asteroid_spawner';
import { buildUniverse, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 300, y: 300, orientation: Math.PI * 1.5 }),
    new AsteroidSpawner({
      x: 600,
      y: 700,
      spawnRatePerSecond: 2,
      spawnDirection: Math.PI * 1.1,
      spawnSpeed: 0.2,
    }),
    new AsteroidSpawner({
      x: 800,
      y: 600,
      spawnRatePerSecond: 2,
      spawnDirection: Math.PI * 1.3,
      spawnSpeed: 0.2,
    }),
    new Planet({ x: 300, y: 300, texture: '#0f0', rotationSpeed: 1 }),
    new GoalPlanet({ x: 600, y: 600, texture: '#333', goalTexture: '#ff0' }),
  ],
}));
