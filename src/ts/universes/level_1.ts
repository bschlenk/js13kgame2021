import { GoalPlanet, Planet, UniversePlayer } from '../universe';
import { buildUniverse, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 100, y: 100, orientation: Math.PI / 4 }),
    new Planet({ x: 100, y: 100, texture: '#f00' }),
    new GoalPlanet({ x: 300, y: 300, texture: '#f00', goalTexture: '#ff26' }),
  ],
}));
