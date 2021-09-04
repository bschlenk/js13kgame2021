import { handleCollisions } from '../collision';
import { Universe, UniverseObject, UniversePlayer } from '../universe';

export function buildUniverse(...objects: UniverseObject[]): Universe {
  const universe = {
    points: 0,
    objects,
  };
  const player = objects.find(
    (object) => object instanceof UniversePlayer,
  )! as UniversePlayer;
  handleCollisions(player, universe);
  return universe;
}
