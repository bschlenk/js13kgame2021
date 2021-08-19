import {
  canvas,
  canvasContext,
  clearCanvas,
  createVerticalGradient,
} from './canvas';
import { renderPauseMenu } from './menu';
import {
  UniverseObject,
  UniverseCircle,
  isUniverseCircle,
  isObjectWithMass,
  UniversePlayer,
  isPlayer,
} from './universe';

const MAX_JUMP_CHARGE = 100;
const JUMP_CHARGE_CYCLE_TIME_MS = 1000;
const JUMP_CHARGE_RATE = (MAX_JUMP_CHARGE * 2) / JUMP_CHARGE_CYCLE_TIME_MS;

let isSpacePressed = false;

const universe: (UniverseObject | UniverseCircle | UniversePlayer)[] = [
  {
    x: 300,
    y: 200,
    mass: 100,
    hasGravitationalForce: false,
    radius: 10,
    texture: '#000',
    isFixed: true,
    orientation: Math.PI * 0.5,
    isPlayer: true,
    jumpCharge: 0,
    jumpChargeDirection: 1,
    velocity: { dx: 0, dy: 0 },
  },
  {
    x: 300,
    y: 300,
    mass: 100,
    hasGravitationalForce: false,
    radius: 30,
    texture: '#f00',
    isFixed: true,
    orientation: Math.PI * 0.5,
  },
  {
    x: 600,
    y: 300,
    mass: 100,
    hasGravitationalForce: false,
    radius: 30,
    texture: '#33f',
    isFixed: true,
    orientation: 0,
  },
  {
    x: 130,
    y: 305,
    mass: 5,
    hasGravitationalForce: false,
    radius: 5,
    texture: '#0f0',
    isFixed: false,
    velocity: {
      dx: 0.03,
      dy: 0.03,
    },
    orientation: 0,
  },
  {
    x: 50,
    y: 35,
    mass: 5,
    hasGravitationalForce: false,
    radius: 5,
    texture: '#0f0',
    isFixed: false,
    velocity: {
      dx: 0.03,
      dy: -0.03,
    },
    orientation: 0,
  },
];

/**
 * Implementation inspired by https://css-tricks.com/creating-your-own-gravity-and-space-simulator
 */
function updateUniverse(
  universe: (UniverseObject | UniverseCircle)[],
  timeDeltaMs: DOMHighResTimeStamp,
) {
  const player = universe.find(isPlayer)!;
  if (isSpacePressed) {
    if (player.isFixed) {
      // we are stationary, that means we can press space
      const increment =
        player.jumpChargeDirection * JUMP_CHARGE_RATE * timeDeltaMs;
      let newCharge = player.jumpCharge + increment;
      if (newCharge > 100) {
        player.jumpChargeDirection = -1;
        newCharge -= newCharge - 100;
      } else if (newCharge < 0) {
        player.jumpChargeDirection = 1;
        newCharge = Math.abs(newCharge);
      }

      player.jumpCharge = newCharge;
    }
  } else {
    const charge = player.jumpCharge;
    // if charge is non-zero, then we have just released space bar
    if (charge) {
      player.jumpCharge = 0;
      player.jumpChargeDirection = 1;
      player.isFixed = false;
      player.velocity.dy = charge * 0.002;
    }
  }

  // This should be re-used later to calculate acceleration for moveable objects
  const objectsWithMass = universe.filter(isObjectWithMass);
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

    if (isUniverseCircle(moveableObject)) {
      moveableObject.orientation = Math.atan2(accY, accX);
    }

    moveableObject.x += moveableObject.velocity.dx * timeDeltaMs;
    moveableObject.y += moveableObject.velocity.dy * timeDeltaMs;

    // Search each of our objects to ensure we don't have any collisions
    universe.forEach((universeObject) => {
      // TODO
      if (isPlayer(moveableObject) || isPlayer(universeObject)) return;

      if (
        universeObject !== moveableObject &&
        isUniverseCircle(universeObject) &&
        isUniverseCircle(moveableObject)
      ) {
        const minDistance = moveableObject.radius + universeObject.radius;
        if (
          Math.abs(moveableObject.x - universeObject.x) < minDistance &&
          Math.abs(moveableObject.y - universeObject.y) < minDistance
        ) {
          console.log('Collision!');
          const index = universe.indexOf(moveableObject);
          if (index > -1) {
            universe.splice(index, 1);
          }

          // Check if the other object should go away too
          if (!universeObject.isFixed) {
            const index = universe.indexOf(universeObject);
            if (index > -1) {
              universe.splice(index, 1);
            }
          }
        }
      }
    });
  });
}

let isPaused = false;

let lastFrame: DOMHighResTimeStamp = 0;

function onRequestAnimationFrame(time: DOMHighResTimeStamp) {
  if (isPaused) {
    renderPauseMenu();
    return;
  }
  clearCanvas();

  // Temporary code to randomly add in asteroids every second
  if (Math.floor(time / 1000) - Math.floor(lastFrame / 1000)) {
    universe.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      mass: 5,
      hasGravitationalForce: false,
      radius: 5,
      texture: '#0f0',
      isFixed: false,
      velocity: {
        dx: 0.03,
        dy: -0.03,
      },
      orientation: 0,
    });
  }

  const timeSinceLastFrame = time - lastFrame;
  lastFrame = time;

  console.debug(`FPS: ${1000 / timeSinceLastFrame}`);

  // Run physics engine
  updateUniverse(universe, timeSinceLastFrame);

  // Draw
  universe.forEach((universeObject) => {
    if (isUniverseCircle(universeObject)) {
      canvasContext.beginPath();
      canvasContext.fillStyle = createVerticalGradient(
        universeObject.texture,
        '#000',
        universeObject.x,
        universeObject.y,
        universeObject.radius * 2,
        universeObject.radius * 2,
        universeObject.orientation,
      );
      canvasContext.arc(
        universeObject.x,
        universeObject.y,
        universeObject.radius,
        0,
        2 * Math.PI,
      );
      canvasContext.fill();
    }

    if (isPlayer(universeObject)) {
      const { x, y, jumpCharge: charge, radius } = universeObject;

      if (!charge) return;

      canvasContext.fillStyle = '#e43';
      const xPos = x + radius + 10;
      const yPos = y - charge;
      canvasContext.fillRect(xPos, yPos, 10, charge);
    }
  });
}

function pauseGame() {
  isPaused = true;
}

function resumeGame() {
  isPaused = false;
}

function onKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'Escape': {
      pauseGame();
      return;
    }
    case ' ': {
      e.preventDefault();
      if (isPaused) {
        resumeGame();
      }
      isSpacePressed = true;
      return;
    }
    default: {
      console.debug('Unhandled keypress', e.key);
    }
  }
}

function onKeyUp(e: KeyboardEvent) {
  switch (e.key) {
    case ' ': {
      e.preventDefault();
      isSpacePressed = false;
    }
  }
}

export { onRequestAnimationFrame, pauseGame, resumeGame, onKeyDown, onKeyUp };
