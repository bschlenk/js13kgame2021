import { Universe, UniverseCircle, UniversePlayer } from './universe';
import { handlePlayerInteraction } from './player';
import { vecDistance } from './vector';
import { removeFromArray } from './utils';

export function doCirclesIntersect(
  a: UniverseCircle,
  b: UniverseCircle,
): boolean {
  const maxDistance = a.radius + b.radius;
  return vecDistance(a.pos, b.pos) < maxDistance;
}

export function checkForCollisions(
  moveableObject: UniverseCircle,
  universe: Universe,
) {
  const universeObjects = universe.objects;
  universeObjects.forEach((universeObject) => {
    if (
      universeObject === moveableObject ||
      universeObject instanceof UniversePlayer
    ) {
      return;
    }

    if (moveableObject instanceof UniversePlayer) {
      if (
        universeObject instanceof UniverseCircle &&
        doCirclesIntersect(moveableObject, universeObject)
      ) {
        handlePlayerInteraction(moveableObject, universeObject, universe);
      }
      return;
    }

    if (
      universeObject instanceof UniverseCircle &&
      moveableObject instanceof UniverseCircle
    ) {
      if (doCirclesIntersect(universeObject, moveableObject)) {
        console.log('Collision!');
        removeFromArray(universeObjects, moveableObject);

        // Check if the other object should go away too
        if (!universeObject.isFixed) {
          removeFromArray(universeObjects, universeObject);
        }
      }
    }
  });
}
