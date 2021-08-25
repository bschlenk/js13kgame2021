import {
  Universe,
  UniverseCircle,
  UniversePlayer,
  UniverseCollectible,
} from './universe';

export function handlePlayerInteraction(
  _player: UniversePlayer,
  circle: UniverseCircle,
  universe: Universe,
) {
  const universeObjects = universe.objects;
  if (circle instanceof UniverseCollectible) {
    universe.points += circle.points;
    const index = universeObjects.indexOf(circle);
    if (index > -1) {
      universeObjects.splice(index, 1);
    }
  }
}
