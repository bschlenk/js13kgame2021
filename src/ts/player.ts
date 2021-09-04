import { onGoalAchieved } from './game';
import {
  Universe,
  UniverseCircle,
  UniversePlayer,
  UniverseCollectible,
  Planet,
  GoalPlanet,
} from './universe';
import { removeFromArray } from './utils';
import { vecAngleBetween } from './vector';

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

  if (circle instanceof Planet && !player.isFixed) {
    // this is a planet, we want to land on it
    player.isFixed = true;
    player.planetAttachment = {
      planet: circle,
      orientationOffset:
        vecAngleBetween(player.vector, circle.vector) - circle.orientation,
    };
  }

  if (circle instanceof GoalPlanet) {
    onGoalAchieved();
  }
}
