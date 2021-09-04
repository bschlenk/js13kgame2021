import { GoalPlanet, Planet, Universe, UniversePlayer } from '../universe';
import { buildUniverse } from './builder';

export const universe: Universe = buildUniverse(
  new UniversePlayer({ x: 100, y: 100, orientation: Math.PI / 4 }),
  new Planet({ x: 100, y: 100, texture: '#f00' }),
  new GoalPlanet({ x: 300, y: 300, texture: '#f00', goalTexture: '#ff26' }),
);
