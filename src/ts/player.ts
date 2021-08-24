import {
  isCollectible,
  Universe,
  UniverseCircle,
  UniversePlayer,
} from './universe';
import {
  removeFromArray,
  vecAngleBetween,
  vecFromAngleAndScale,
} from './utils';

export function handlePlayerInteraction(
  player: UniversePlayer,
  circle: UniverseCircle,
  universe: Universe,
) {
  const universeObjects = universe.objects;
  if (isCollectible(circle)) {
    universe.points += circle.points;
    removeFromArray(universeObjects, circle);
  }

  // TODO: need better test for planet
  if (circle.isFixed && !(circle as any).points) {
    // this is a planet, we want to land on it
    player.isFixed = true;
    player.orientation = vecAngleBetween(player, circle);

    const dist = player.radius + circle.radius;
    const { x, y } = vecFromAngleAndScale(player.orientation, dist);

    player.x = circle.x + x;
    player.y = circle.y + y;

    player.velocity.dx = 0;
    player.velocity.dy = 0;
  }
}
