import { UniversePlayer } from '../universe';
import { buildUniverse, planetWithDebris, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  targetGoalPoints: 1,
  objects: [
    new UniversePlayer({ x: 300, y: 300, orientation: Math.PI * 1.5 }),
    ...planetWithDebris(
      { x: 300, y: 300, texture: '#0f0', rotationSpeed: 1 },
      3,
    ),
  ],
}));
