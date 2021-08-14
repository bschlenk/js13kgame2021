import { canvas, canvasContext } from './canvas';
import {
  UniverseObject,
  UniverseCircle,
  isUniverseCircle,
  isObjectWithMass,
  UniverseObjectWithMass,
} from './universe';

const universe: (UniverseObject | UniverseCircle)[] = [
  {
    x: 300,
    y: 300,
    mass: 100,
    hasGravitationalForce: false,
    radius: 30,
    texture: '#f00',
    isFixed: true,
  },
  {
    x: 130,
    y: 305,
    mass: 100,
    hasGravitationalForce: false,
    radius: 5,
    texture: '#0f0',
    isFixed: false,
    velocity: {
      dx: 0.03,
      dy: 0.03,
    },
  },
  {
    x: 50,
    y: 35,
    mass: 100,
    hasGravitationalForce: false,
    radius: 5,
    texture: '#0f0',
    isFixed: false,
    velocity: {
      dx: 0.03,
      dy: -0.03,
    },
  },
];

/**
 * Implementation inspired by https://css-tricks.com/creating-your-own-gravity-and-space-simulator
 */
function updateUniverse(
  universe: (UniverseObject | UniverseCircle)[],
  timeDeltaMs: DOMHighResTimeStamp,
) {
  // This should be re-used later to calculate acceleration for moveable objects
  const objectsWithMass: UniverseObjectWithMass[] = universe.flatMap((object) =>
    isObjectWithMass(object) ? [object] : [],
  );
  const moveableObjects = objectsWithMass.filter((object) => !object.isFixed);

  moveableObjects.forEach((moveableObject) => {
    moveableObject.velocity = moveableObject.velocity ?? { dx: 0, dy: 0 };

    let accX = 0;
    let accY = 0;
    objectsWithMass.forEach((objectWithMass) => {
      if (moveableObject === objectWithMass) {
        return;
      }

      /** Prevent division by zero */
      const minDelta = 0.00000001;
      const xDelta = objectWithMass.x - moveableObject.x || minDelta;
      const yDelta = objectWithMass.y - moveableObject.y || minDelta;
      const distSq = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));

      /** Gravitational Constant */
      const g = 0.00002;
      const softeningConstant = 0.15;
      const f =
        (g * moveableObject.mass) /
        (distSq * Math.sqrt(distSq + softeningConstant));

      accX += xDelta * f;
      accY += yDelta * f;
    });
    moveableObject.velocity.dx += accX * timeDeltaMs;
    moveableObject.velocity.dy += accY * timeDeltaMs;

    moveableObject.x += moveableObject.velocity.dx * timeDeltaMs;
    moveableObject.y += moveableObject.velocity.dy * timeDeltaMs;
  });
}

let lastFrame: DOMHighResTimeStamp = 0;

function onRequestAnimationFrame(time: DOMHighResTimeStamp) {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  const timeSinceLastFrame = time - lastFrame;
  lastFrame = time;

  console.debug(`FPS: ${1000 / timeSinceLastFrame}`);

  // Run physics engine
  updateUniverse(universe, timeSinceLastFrame);

  // Draw
  universe.forEach((universeObject) => {
    if (isUniverseCircle(universeObject)) {
      canvasContext.beginPath();
      canvasContext.fillStyle = universeObject.texture;
      canvasContext.arc(
        universeObject.x,
        universeObject.y,
        universeObject.radius,
        0,
        2 * Math.PI,
      );
      canvasContext.fill();
    }
  });
}

function pauseGame() {
  // Pause?
}

export { onRequestAnimationFrame, pauseGame };
