import { Background } from './background';
import {
  canvas,
  canvasContext,
  clearCanvas,
  createVerticalGradient,
  fillRect,
} from './canvas';
import { handleCollisions } from './collision';
import { renderPauseMenu } from './menu';
import { updateDebris } from './update';
import {
  Universe,
  UniverseObjectWithMass,
  UniverseCircle,
  UniversePlayer,
  Planet,
  Debris,
  Asteroid,
} from './universe';
import { vecFromAngleAndScale } from './vector';

const MAX_JUMP_CHARGE = 100;
const JUMP_CHARGE_CYCLE_TIME_MS = 1000;
const JUMP_CHARGE_RATE = (MAX_JUMP_CHARGE * 2) / JUMP_CHARGE_CYCLE_TIME_MS;

let isSpacePressed = false;

const background = new Background();

const universe: Universe = {
  points: 0,
  objects: [
    new UniversePlayer(300, 200),
    new Planet(300, 300, '#f00'),
    new Planet(600, 300, '#33f'),
  ],
};

// Generate space debris with planets as the base
let debrisInTheTrunk = [] as Debris[];
universe.objects.forEach((element) => {
  if (element instanceof Planet) {
    // Generate anywhere from 10-20 particles randomly
    const particleCount = Math.floor(Math.random() * 10 + 10);
    const newDebrisInTheTrunk = new Array(particleCount)
      .fill(0)
      .map((_) => new Debris(element));
    debrisInTheTrunk = debrisInTheTrunk.concat(newDebrisInTheTrunk);
  }
});
universe.objects = universe.objects.concat(debrisInTheTrunk);

/**
 * Implementation inspired by https://css-tricks.com/creating-your-own-gravity-and-space-simulator
 */
function updateUniverse(universe: Universe, timeDeltaMs: DOMHighResTimeStamp) {
  const universeObjects = universe.objects;
  background.update(timeDeltaMs);
  const player = universeObjects.find(
    (item) => item instanceof UniversePlayer,
  )! as UniversePlayer;
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
      player.vector.dx = x;
      player.vector.dy = y;
    }
  }

  // This should be re-used later to calculate acceleration for moveable objects
  const objectsWithMass = universeObjects.filter(
    (object) => object instanceof UniverseObjectWithMass,
  ) as UniverseObjectWithMass[];
  const moveableObjects = objectsWithMass.filter(
    (object) => !object.isFixed,
  ) as UniverseCircle[];

  moveableObjects.forEach((moveableObject) => {
    if (moveableObject instanceof Debris) {
      updateDebris(moveableObject, timeDeltaMs);
      return;
    }

    moveableObject.vector = moveableObject.vector ?? { dx: 0, dy: 0 };

    let accX = 0;
    let accY = 0;
    objectsWithMass.forEach((objectWithMass) => {
      if (moveableObject === objectWithMass) {
        return;
      }
      // Don't let the player be dragged around by asteroids.
      if (moveableObject instanceof UniversePlayer && !objectWithMass.isFixed) {
        return;
      }

      /** Prevent division by zero */
      const minDelta = 0.00000001;
      const xDelta =
        objectWithMass.vector.x - moveableObject.vector.x || minDelta;
      const yDelta =
        objectWithMass.vector.y - moveableObject.vector.y || minDelta;
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
    moveableObject.vector.dx += accX * timeDeltaMs;
    moveableObject.vector.dy += accY * timeDeltaMs;

    if (moveableObject instanceof UniverseCircle) {
      moveableObject.orientation = Math.atan2(accY, accX);
    }

    moveableObject.vector.x += moveableObject.vector.dx * timeDeltaMs;
    moveableObject.vector.y += moveableObject.vector.dy * timeDeltaMs;

    // Search each of our objects to ensure we don't have any collisions
    handleCollisions(moveableObject, universe);
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
    universeObjects.push(
      new Asteroid(Math.random() * canvas.width, Math.random() * canvas.height),
    );
  }

  const timeSinceLastFrame = time - lastFrame;
  lastFrame = time;

  console.debug(`FPS: ${1000 / timeSinceLastFrame}`);

  // Run physics engine
  updateUniverse(universe, timeSinceLastFrame);

  // Draw
  background.render();
  universeObjects.forEach((universeObject) => {
    if (universeObject instanceof UniverseCircle) {
      canvasContext.beginPath();
      canvasContext.fillStyle = createVerticalGradient(
        universeObject.texture,
        '#000',
        universeObject.vector.x,
        universeObject.vector.y,
        universeObject.radius * 2,
        universeObject.radius * 2,
        universeObject.orientation,
      );
      canvasContext.arc(
        universeObject.vector.x,
        universeObject.vector.y,
        universeObject.radius,
        0,
        2 * Math.PI,
      );
      canvasContext.fill();
    }

    if (universeObject instanceof UniversePlayer) {
      const { vector, jumpCharge: charge, radius } = universeObject;

      if (!charge) return;

      canvasContext.fillStyle = '#e43';
      const chargeWidth = radius;
      const xPos =
        vector.x +
        (radius + chargeWidth / 2) * Math.cos(universeObject.orientation);
      const yPos =
        vector.y +
        (radius + chargeWidth / 2) * Math.sin(universeObject.orientation);
      const angle = universeObject.orientation - Math.PI / 2;

      fillRect(xPos, yPos, chargeWidth, charge, angle);
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
