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
import { vecAngleBetween, vecEquals } from './vector';

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

    // This is a special case to aid setting up universes. Place players in the middle of a planet
    // but orient it in the direction you want it to appear on the planet to begin.
    let orientationOffset;
    if (vecEquals(player.vector, circle.vector)) {
      orientationOffset = player.orientation;
    } else {
      orientationOffset =
        vecAngleBetween(player.vector, circle.vector) - circle.orientation;
    }
    player.planetAttachment = {
      planet: circle,
      orientationOffset,
    };
  }

  if (circle instanceof GoalPlanet) {
    onGoalAchieved();
  }
}
