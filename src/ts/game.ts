import { canvas, canvasContext } from './canvas';
import { UniverseObject, UniverseCircle, isUniverseCircle } from './universe';

const universe: (UniverseObject | UniverseCircle)[] = [
  {
    x: 40,
    y: 40,
    mass: 100,
    hasGravitationalForce: false,
    radius: 30,
    texture: '#f00',
  },
  {
    x: 30,
    y: 35,
    mass: 100,
    hasGravitationalForce: false,
    radius: 5,
    texture: '#0f0',
  },
  {
    x: 50,
    y: 35,
    mass: 100,
    hasGravitationalForce: false,
    radius: 5,
    texture: '#0f0',
  },
];

let lastFrame: DOMHighResTimeStamp = 0;

function onRequestAnimationFrame(time: DOMHighResTimeStamp) {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  const timeSinceLastFrame = time - lastFrame;
  lastFrame = time;

  console.debug(`FPS: ${1000 / timeSinceLastFrame}`);

  // Run physics engine
  universe.forEach((_universeObject) => {
    // Update positions of things using timeSinceLastFrame
  });

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
