import {
  Universe,
  UniverseCircle,
  UniversePlayer,
  UniverseCollectible,
  Planet,
} from './universe';
import { removeFromArray } from './utils';
import { vecAngleBetween, vecFromAngleAndScale } from './vector';

export function handlePlayerInteraction(
  player: UniversePlayer,
  circle: UniverseCircle,
  universe: Universe,
) {
  const universeObjects = universe.objects;
  if (circle instanceof UniverseCollectible) {
    universe.points += circle.points;
    removeFromArray(universeObjects, circle);
  }

  if (circle instanceof Planet) {
    // this is a planet, we want to land on it
    player.isFixed = true;
    player.orientation = vecAngleBetween(player.vector, circle.vector);

    const dist = player.radius + circle.radius;
    const { x, y } = vecFromAngleAndScale(player.orientation, dist);

    player.vector.x = circle.vector.x + x;
    player.vector.y = circle.vector.y + y;

    player.vector.dx = 0;
    player.vector.dy = 0;
  }
}
