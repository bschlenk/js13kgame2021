import { Planet, Universe, UniversePlayer } from '../universe';
import { buildUniverse } from './builder';

export const universe: Universe = buildUniverse(
  new UniversePlayer(300, 200),
  new Planet(300, 300, '#f00'),
  new Planet(600, 300, '#33f'),
);
