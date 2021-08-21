import { isJunk, Universe, UniverseCircle, UniversePlayer } from './universe';
import { removeFromArray } from './utils';

export function handlePlayerInteraction(
  _player: UniversePlayer,
  circle: UniverseCircle,
  universe: Universe,
) {
  const universeObjects = universe.objects;
  if (isJunk(circle)) {
    universe.points += circle.points;
    removeFromArray(universeObjects, circle);
  }
}
