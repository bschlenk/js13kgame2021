import { Universe, UniverseCircle, UniversePlayer } from './universe';
import { handlePlayerInteraction } from './player';

function doCirclesIntersect(a: UniverseCircle, b: UniverseCircle): boolean {
  const maxDistance = a.radius + b.radius;
  return (
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) < maxDistance
  );
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
        const index = universeObjects.indexOf(moveableObject);
        if (index > -1) {
          universeObjects.splice(index, 1);
        }

        // Check if the other object should go away too
        if (!universeObject.isFixed) {
          const index = universeObjects.indexOf(universeObject);
          if (index > -1) {
            universeObjects.splice(index, 1);
          }
        }
      }
    }
  });
}
