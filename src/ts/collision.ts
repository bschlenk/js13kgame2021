import { Debris, Universe, UniverseCircle, UniversePlayer } from './universe';
import { handlePlayerInteraction } from './player';
import { vecDistance } from './vector';
import { removeFromArray } from './utils';

export function doCirclesIntersect(
  a: UniverseCircle,
  b: UniverseCircle,
): boolean {
  const maxDistance = a.radius + b.radius;
  return vecDistance(a.position, b.position) < maxDistance;
}

export function handleCollisions(circle: UniverseCircle, universe: Universe) {
  const universeObjects = universe.objects;
  universeObjects.forEach((universeObject) => {
    if (universeObject === circle || universeObject instanceof UniversePlayer) {
      return;
    }

    if (circle instanceof UniversePlayer) {
      if (
        universeObject instanceof UniverseCircle &&
        doCirclesIntersect(circle, universeObject)
      ) {
        handlePlayerInteraction(circle, universeObject, universe);
      }
      return;
    }

    if (universeObject instanceof Debris && circle instanceof Debris) {
      // debris shouldn't collide with eachother
      return;
    }

    if (
      universeObject instanceof UniverseCircle &&
      circle instanceof UniverseCircle
    ) {
      if (doCirclesIntersect(universeObject, circle)) {
        removeFromArray(universeObjects, circle);

        // Check if the other object should go away too
        if (!universeObject.isFixed) {
          removeFromArray(universeObjects, universeObject);
        }
      }
    }
  });
}
