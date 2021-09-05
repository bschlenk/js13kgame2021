import { Planet, UniversePlayer } from '../universe';
import { buildUniverse, UniverseBuilder } from './builder';

export const universe: UniverseBuilder = buildUniverse(() => ({
  objects: [
    new UniversePlayer({ x: 300, y: 200 }),
    new Planet({ x: 300, y: 300, texture: '#f00' }),
    new Planet({ x: 600, y: 300, texture: '#33f' }),
  ],
}));
