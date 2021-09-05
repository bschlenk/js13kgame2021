import { Universe, UniversePlayer } from '../universe';
import { buildUniverse, planetWithDebris } from './builder';

export const universe: Universe = buildUniverse({
  targetGoalPoints: 1,
  objects: [
    new UniversePlayer({ x: 300, y: 300, orientation: Math.PI * 1.5 }),
    ...planetWithDebris(
      { x: 300, y: 300, texture: '#0f0', rotationSpeed: 1 },
      3,
    ),
  ],
});
