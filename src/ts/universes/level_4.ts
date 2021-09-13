import { UniversePlayer, UniverseText } from '../universe';
import { buildUniverse, planetWithDebris, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  targetGoalPoints: 3,
  objects: [
    new UniversePlayer({ x: 300, y: 300, orientation: Math.PI * 1.5 }),
    ...planetWithDebris(
      { x: 300, y: 300, texture: '#0f0', rotationSpeed: 1 },
      3,
    ),
    new UniverseText({
      x: 640,
      y: 450,
      fontSize: 32,
      text: 'Collect space debris along your way for points',
    }),
  ],
}));
