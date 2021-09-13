import { GoalPlanet, Planet, UniversePlayer } from '../universe';
import { buildUniverse, planetWithDebris, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 400, y: 600, orientation: Math.PI * 1.5 }),
    new Planet({ x: 400, y: 600, texture: '#cfc', rotationSpeed: 1 }),
    ...planetWithDebris(
      { x: 600, y: 200, texture: '#fa2', rotationSpeed: 1 },
      20,
    ),
    ...planetWithDebris(
      { x: 750, y: 350, texture: '#2df', rotationSpeed: 1 },
      20,
    ),
    ...planetWithDebris(
      { x: 450, y: 350, texture: '#a2d', rotationSpeed: 1 },
      20,
    ),
    new GoalPlanet({ x: 800, y: 600, texture: '#333', goalTexture: '#ff0' }),
  ],
}));
