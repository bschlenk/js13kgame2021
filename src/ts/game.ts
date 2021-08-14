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
    x: 40,
    y: 40,
    mass: 100,
    hasGravitationalForce: false,
    radius: 30,
    texture: '#f00',
    isFixed: true,
  },
  {
    x: 30,
    y: 35,
    mass: 100,
    hasGravitationalForce: false,
    radius: 5,
    texture: '#0f0',
    isFixed: false,
    velocity: {
      dx: 0.03,
      dy: 0.01,
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
  },
];

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
    if (moveableObject.velocity === undefined) {
      return;
    }
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
