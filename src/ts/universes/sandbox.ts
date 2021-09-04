import { Planet, Universe, UniversePlayer } from '../universe';

export const universe: Universe = {
  points: 0,
  objects: [
    new UniversePlayer(300, 200),
    new Planet(300, 300, '#f00'),
    new Planet(600, 300, '#33f'),
  ],
};
