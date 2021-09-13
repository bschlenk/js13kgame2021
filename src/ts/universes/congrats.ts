import { Planet, UniversePlayer, UniverseText } from '../universe';
import { buildUniverse, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 400, y: 200, orientation: Math.PI / 4 }),
    new Planet({ x: 400, y: 200, texture: '#f00', rotationSpeed: 10 }),
    new Planet({ x: 600, y: 300, texture: '#00f', rotationSpeed: -10 }),
    new Planet({ x: 500, y: 600, texture: '#0f0', rotationSpeed: 10 }),
    new UniverseText({
      x: 640,
      y: 450,
      fontSize: 32,
      text: 'Congratulations, you win!',
    }),
    new UniverseText({
      x: 640,
      y: 525,
      fontSize: 24,
      text: 'Press "r" to reset your progress',
    }),
  ],
}));
