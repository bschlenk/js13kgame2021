import { GoalPlanet, Planet, UniversePlayer } from '../universe';
import { buildUniverse, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 100, y: 100, orientation: Math.PI }),
    new Planet({ x: 100, y: 100, texture: '#0f0', rotationSpeed: 0.3 }),
    new GoalPlanet({ x: 300, y: 300, texture: '#f00', goalTexture: '#ff26' }),
  ],
}));
