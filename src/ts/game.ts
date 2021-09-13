import { Background } from './background';
import { canvasContext, clearCanvas } from './canvas';
import * as universes from './universes';
import { handleCollisions } from './collision';
import { renderPauseMenu } from './menu';
import {
  Universe,
  UniverseObjectWithMass,
  UniverseCircle,
  UniversePlayer,
} from './universe';
import { vec, vecFromAngleAndScale } from './vector';
import { getLevel, setLevel } from './utils';

const MAX_JUMP_CHARGE = 100;
const JUMP_CHARGE_CYCLE_TIME_MS = 1000;
const JUMP_CHARGE_RATE = (MAX_JUMP_CHARGE * 2) / JUMP_CHARGE_CYCLE_TIME_MS;
const GRAVITATIONAL_CONSTANT = 0.00004;
const SOFTENING_CONSTANT = 0.5;

let isSpacePressed = false;

const background = new Background();

const levels = [
  universes.level_1,
  universes.level_2,
  universes.level_3,
  universes.level_4,
  universes.level_5,
];

let currentLevel = getLevel();

// Don't crash if we beat the game
if (currentLevel >= levels.length) {
  setLevel(0);
  currentLevel = getLevel();
}

let universe: Universe = levels[currentLevel]();

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
      player.velocity = { x, y };
    }
  }

  universeObjects.forEach((universeObject) =>
    universeObject.updateSelf(universe, timeDeltaMs),
  );

  // This should be re-used later to calculate acceleration for moveable objects
  const objectsWithMass = universeObjects.filter(
    (object) => object instanceof UniverseObjectWithMass,
  ) as UniverseObjectWithMass[];
  const moveableObjects = objectsWithMass.filter(
    (object) => !object.isFixed,
  ) as UniverseCircle[];

  moveableObjects.forEach((moveableObject) => {
    moveableObject.velocity = moveableObject.velocity || vec(0, 0);

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
        objectWithMass.position.x - moveableObject.position.x || minDelta;
      const yDelta =
        objectWithMass.position.y - moveableObject.position.y || minDelta;
      const distSq = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));

      const f =
        (GRAVITATIONAL_CONSTANT * moveableObject.mass) /
        (distSq * Math.sqrt(distSq + SOFTENING_CONSTANT));

      accX += xDelta * f;
      accY += yDelta * f;
    });
    moveableObject.velocity.x += accX * timeDeltaMs;
    moveableObject.velocity.y += accY * timeDeltaMs;

    if (moveableObject instanceof UniverseCircle) {
      moveableObject.orientation = Math.atan2(accY, accX);
    }

    moveableObject.position.x += moveableObject.velocity.x * timeDeltaMs;
    moveableObject.position.y += moveableObject.velocity.y * timeDeltaMs;

    // Search each of our objects to ensure we don't have any collisions
    handleCollisions(moveableObject, universe);
  });
}

let isPaused = false;

let lastFrame: DOMHighResTimeStamp = 0;

export function onRequestAnimationFrame(time: DOMHighResTimeStamp) {
  if (isPaused) {
    renderPauseMenu();
    return;
  }
  clearCanvas();

  const universeObjects = universe.objects;

  const timeSinceLastFrame = time - lastFrame;
  lastFrame = time;

  console.debug(`FPS: ${1000 / timeSinceLastFrame}`);

  // Run physics engine
  updateUniverse(universe, timeSinceLastFrame);

  // Draw
  background.render();
  universeObjects.forEach((universeObject) => {
    universeObject.draw();
  });
  drawPoints(universe);
}

function drawPoints(universe: Universe) {
  canvasContext.fillStyle = '#eee';
  canvasContext.font = '30px sans-serif';
  canvasContext.fillText(`Points: ${universe.points}`, 10, 40);
}

export function onGoalAchieved() {
  setLevel(++currentLevel);
  universe = levels[currentLevel]();
}

export function onUniversePointsUpdated(universe: Universe) {
  const { targetGoalPoints } = universe;
  if (targetGoalPoints != null && universe.points >= targetGoalPoints) {
    onGoalAchieved();
  }
}

export function onLose(_currentUniverse: Universe) {
  universe = levels[currentLevel]();
}

export function pauseGame() {
  isPaused = true;
}

export function resumeGame() {
  isPaused = false;
}

export function onKeyDown(e: KeyboardEvent) {
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
    case 'r': {
      setLevel(0);
      location.reload();
      return;
    }
    case 'n': {
      if (import.meta.env.DEV) {
        onGoalAchieved();
      }
      return;
    }
    default: {
      console.debug('Unhandled keypress', e.key);
    }
  }
}

export function onKeyUp(e: KeyboardEvent) {
  switch (e.key) {
    case ' ': {
      e.preventDefault();
      isSpacePressed = false;
    }
  }
}
