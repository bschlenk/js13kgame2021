import { Background } from './background';
import {
  canvas,
  canvasContext,
  clearCanvas,
  createVerticalGradient,
} from './canvas';
import { doCirclesIntersect } from './collision';
import { renderPauseMenu } from './menu';
import { handlePlayerInteraction } from './player';
import {
  isUniverseCircle,
  isObjectWithMass,
  isPlayer,
  Universe,
  UniverseCollectible,
} from './universe';
import { removeFromArray, vecFromAngleAndScale } from './utils';

const MAX_JUMP_CHARGE = 100;
const JUMP_CHARGE_CYCLE_TIME_MS = 1000;
const JUMP_CHARGE_RATE = (MAX_JUMP_CHARGE * 2) / JUMP_CHARGE_CYCLE_TIME_MS;

let isSpacePressed = false;

const background = new Background();

const universe: Universe = {
  points: 0,
  objects: [
    {
      x: 300,
      y: 200,
      mass: 100,
      hasGravitationalForce: false,
      radius: 10,
      texture: '#fff',
      isFixed: false,
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
    ...[...new Array(10)].map<UniverseCollectible>((_) => ({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      points: 1,
      radius: 20,
      texture: '#fff',
      orientation: 0,
      mass: 0,
      hasGravitationalForce: false,
      isFixed: true,
    })),
  ],
};

/**
 * Implementation inspired by https://css-tricks.com/creating-your-own-gravity-and-space-simulator
 */
function updateUniverse(universe: Universe, timeDeltaMs: DOMHighResTimeStamp) {
  const universeObjects = universe.objects;
  background.update(timeDeltaMs);
  const player = universeObjects.find(isPlayer)!;
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
      const { x, y } = vecFromAngleAndScale(player.orientation, charge * 0.002);
      player.velocity.dx = x;
      player.velocity.dy = y;
    }
  }

  // This should be re-used later to calculate acceleration for moveable objects
  const objectsWithMass = universeObjects.filter(isObjectWithMass);
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
    universeObjects.forEach((universeObject) => {
      if (universeObject === moveableObject || isPlayer(universeObject)) {
        return;
      }

      if (isPlayer(moveableObject)) {
        if (
          isUniverseCircle(universeObject) &&
          doCirclesIntersect(moveableObject, universeObject)
        ) {
          handlePlayerInteraction(moveableObject, universeObject, universe);
        }
        return;
      }

      if (
        isUniverseCircle(universeObject) &&
        isUniverseCircle(moveableObject)
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

  const universeObjects = universe.objects;

  // Temporary code to randomly add in asteroids every second
  if (Math.floor(time / 1000) - Math.floor(lastFrame / 1000)) {
    universeObjects.push({
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
  background.render();
  universeObjects.forEach((universeObject) => {
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
  drawPoints(universe);
}

function drawPoints(universe: Universe) {
  canvasContext.fillStyle = '#eee';
  canvasContext.font = '30px sans-serif';
  canvasContext.fillText(`Points: ${universe.points}`, 10, 40);
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
