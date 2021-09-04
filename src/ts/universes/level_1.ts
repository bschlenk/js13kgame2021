import { GoalPlanet, Universe, UniversePlayer } from '../universe';
import { buildUniverse } from './builder';

export const universe: Universe = buildUniverse(
  new UniversePlayer(100, 100),
  new GoalPlanet(300, 300, '#f00', '#ff26'),
);
