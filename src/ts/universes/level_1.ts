import { GoalPlanet, Planet, UniversePlayer, UniverseText } from '../universe';
import { buildUniverse, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 400, y: 200, orientation: Math.PI / 4 }),
    new Planet({ x: 400, y: 200, texture: '#f00' }),
    new GoalPlanet({ x: 800, y: 300, texture: '#f00', goalTexture: '#ff26' }),
    new UniverseText({
      x: 640,
      y: 450,
      fontSize: 32,
      text: 'Welcome to Planet Hoppers!',
    }),
    new UniverseText({
      x: 640,
      y: 500,
      fontSize: 24,
      text: 'Hold the spacebar to charge your jump',
    }),
    new UniverseText({
      x: 640,
      y: 550,
      fontSize: 24,
      text: 'release to get to your destination planet!',
    }),
  ],
}));
