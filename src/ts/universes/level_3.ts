import { GoalPlanet, Planet, UniversePlayer } from '../universe';
import { buildUniverse, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 100, y: 100, orientation: Math.PI * 0.75 }),
    new Planet({ x: 100, y: 100, texture: '#0f0' }),
    new Planet({ x: 300, y: 300, texture: '#ff0', rotationSpeed: 0.5 }),
    new GoalPlanet({ x: 700, y: 400, texture: '#f00', goalTexture: '#ff26' }),
  ],
}));
