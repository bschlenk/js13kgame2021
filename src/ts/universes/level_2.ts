import { GoalPlanet, Planet, UniversePlayer, UniverseText } from '../universe';
import { buildUniverse, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 100, y: 100, orientation: Math.PI }),
    new Planet({ x: 100, y: 100, texture: '#0f0', rotationSpeed: 0.5 }),
    new GoalPlanet({ x: 300, y: 300, texture: '#f00', goalTexture: '#ff26' }),
    new UniverseText({
      x: 640,
      y: 450,
      fontSize: 32,
      text: 'Some planets will rotate',
    }),
    new UniverseText({
      x: 640,
      y: 500,
      fontSize: 24,
      text: 'Time your jump just right to get to the destination planet',
    }),
  ],
}));
