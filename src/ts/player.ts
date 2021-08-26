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

  // TODO: need better test for planet
  if (circle instanceof Planet) {
    // this is a planet, we want to land on it
    player.isFixed = true;
    player.orientation = vecAngleBetween(player.pos, circle.pos);

    const dist = player.radius + circle.radius;
    const { x, y } = vecFromAngleAndScale(player.orientation, dist);

    player.pos.x = circle.pos.x + x;
    player.pos.y = circle.pos.y + y;

    player.velocity.dx = 0;
    player.velocity.dy = 0;
  }
}
