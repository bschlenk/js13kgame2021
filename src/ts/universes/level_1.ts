import { Planet, Universe, UniversePlayer } from '../universe';

export const universe: Universe = {
  points: 0,
  objects: [new UniversePlayer(100, 100), new Planet(300, 300, '#f00')],
};
