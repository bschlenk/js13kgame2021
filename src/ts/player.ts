import {
  isCollectible,
  Universe,
  UniverseCircle,
  UniversePlayer,
} from './universe';

export function handlePlayerInteraction(
  _player: UniversePlayer,
  circle: UniverseCircle,
  universe: Universe,
) {
  const universeObjects = universe.objects;
  if (isCollectible(circle)) {
    universe.points += circle.points;
    const index = universeObjects.indexOf(circle);
    if (index > -1) {
      universeObjects.splice(index, 1);
    }
  }
}
