import { Planet, Universe, UniversePlayer } from '../universe';
import { buildUniverse } from './builder';

export const universe: Universe = buildUniverse({
  objects: [
    new UniversePlayer({ x: 300, y: 200 }),
    new Planet({ x: 300, y: 300, texture: '#f00' }),
    new Planet({ x: 600, y: 300, texture: '#33f' }),
  ],
});
