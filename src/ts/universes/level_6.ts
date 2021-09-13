import { UniversePlayer } from '../universe';
import { AsteroidSpawner } from '../universe/asteroid_spawner';
import { buildUniverse, planetWithDebris, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  targetGoalPoints: 3,
  objects: [
    new UniversePlayer({ x: 300, y: 300, orientation: Math.PI * 1.5 }),
    new AsteroidSpawner({
      x: 300,
      y: 700,
      spawnRatePerSecond: 0.2,
      spawnDirection: Math.PI / 2,
      spawnSpeed: 0.2,
    }),
    ...planetWithDebris(
      { x: 300, y: 300, texture: '#0f0', rotationSpeed: 1.4 },
      7,
    ),
    ...planetWithDebris(
      { x: 700, y: 600, texture: '#0a0', rotationSpeed: 1.4 },
      5,
    ),
  ],
}));
