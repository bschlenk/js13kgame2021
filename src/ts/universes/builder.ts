import { handleCollisions } from '../collision';
import {
  Universe,
  UniverseObject,
  UniversePlayer,
  PlanetOptions,
  Planet,
  Debris,
} from '../universe';

export function buildUniverse(options: {
  targetGoalPoints?: number;
  objects: UniverseObject[];
}): Universe {
  const { objects } = options;

  const universe: Universe = {
    points: 0,
    objects,
    targetGoalPoints: options.targetGoalPoints,
  };

  const player = objects.find(
    (object) => object instanceof UniversePlayer,
  )! as UniversePlayer;
  handleCollisions(player, universe);

  return universe;
}

export function planetWithDebris(
  planetOptions: PlanetOptions,
  debrisCount: number,
): UniverseObject[] {
  const planet = new Planet(planetOptions);

  const debris = new Array(debrisCount)
    .fill(0)
    .map((_) => new Debris({ x: 0, y: 0, planet }));
  return [planet, ...debris];
}
