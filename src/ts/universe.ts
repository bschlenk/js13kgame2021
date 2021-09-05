import {
  canvasContext,
  createLinearGradient,
  createRadialGradient,
  fillRect,
} from './canvas';
import { vecFromAngleAndScale } from './vector';

/** The texture to render as. This may become a more complicated type union in the future */
export type Texture = string;

export interface Vector {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface UniverseObjectOptions {
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  isFixed?: boolean;
}

/** The most basic building block of objects in the universe */
export class UniverseObject {
  vector: Vector;
  #isFixed: boolean;

  constructor(options: UniverseObjectOptions) {
    this.vector = { ...options, dx: options.dx ?? 0, dy: options.dy ?? 0 };
    this.#isFixed = options.isFixed ?? true;
  }

  /** Draws the object to the screen */
  draw() {
    // Base implementation does nothing
  }

  /**
   * Run physics engine for self
   */
  updateSelf(_universe: Universe, _timeDeltaMs: DOMHighResTimeStamp) {
    // nothing by default
  }

  get isFixed(): boolean {
    return this.#isFixed;
  }

  set isFixed(value: boolean) {
    this.#isFixed = value;
  }
}

interface UniverseObjectWithMassOptions extends UniverseObjectOptions {
  mass?: number;
}

/** An object with mass, but does not require that it takes up space. E.g. black holes */
export class UniverseObjectWithMass extends UniverseObject {
  mass: number;

  constructor(options: UniverseObjectWithMassOptions) {
    super(options);
    this.mass = options.mass ?? 0;
  }
}

interface UniverseCircleOptions extends UniverseObjectWithMassOptions {
  radius?: number;
  texture?: Texture;
  /** Rotation of object in radians */
  orientation?: number;
  /** Speed of rotation of the circle about its origin in radians per second */
  rotationSpeed?: number;
}

/** A circle that exists in the universe.  */
export class UniverseCircle extends UniverseObjectWithMass {
  radius: number;
  texture: Texture;
  /** Rotation of object in radians */
  orientation: number;
  /** Speed of rotation of the circle about its origin in radians per second */
  rotationSpeed: number;

  constructor(options: UniverseCircleOptions) {
    super(options);
    this.radius = options.radius ?? 10;
    this.texture = options.texture ?? '#fff';
    this.orientation = options.orientation ?? 0;
    this.rotationSpeed = options.rotationSpeed ?? 0;
  }

  draw() {
    canvasContext.beginPath();
    canvasContext.fillStyle = createLinearGradient(
      this.texture,
      '#000',
      this.vector.x,
      this.vector.y,
      this.radius * 2,
      this.radius * 2,
      this.orientation,
    );
    canvasContext.arc(
      this.vector.x,
      this.vector.y,
      this.radius,
      0,
      2 * Math.PI,
    );
    canvasContext.fill();
  }

  updateSelf(universe: Universe, timeDeltaMs: DOMHighResTimeStamp) {
    super.updateSelf(universe, timeDeltaMs);
    this.orientation =
      (this.orientation + (this.rotationSpeed * timeDeltaMs) / 1000) %
      (Math.PI * 2);
  }
}

interface UniverseCollectibleOptions extends UniverseCircleOptions {
  points?: number;
}

/** An item the player can collect for points **/
export class UniverseCollectible extends UniverseCircle {
  points: number;

  constructor(options: UniverseCollectibleOptions) {
    super(options);
    this.points = options.points ?? 1;
  }
}

interface UniversePlayerOptions extends UniverseCircleOptions {
  isFixed?: false;
}

/** The user-controllable player, jumps between planets **/
export class UniversePlayer extends UniverseCircle {
  jumpCharge: number;
  jumpChargeDirection: 1 | -1;
  planetAttachment: {
    // The planet attached to
    planet: Planet;
    // The offset in radians, relative to the orientation of the planet
    orientationOffset: number;
  } | null;

  constructor(options: UniversePlayerOptions) {
    super({
      ...options,
      radius: options.radius ?? 10,
      texture: options.texture ?? '#fff',
      mass: options.mass ?? 40,
      isFixed: false,
    });
    this.jumpChargeDirection = 1;
    this.jumpCharge = 0;
    this.planetAttachment = null;
    this.isFixed = false;
  }

  draw() {
    super.draw();

    const { vector, jumpCharge: charge, radius, orientation } = this;

    if (!charge) return;

    canvasContext.fillStyle = '#e43';
    const chargeWidth = radius;
    const xPos = vector.x + (radius + chargeWidth / 2) * Math.cos(orientation);
    const yPos = vector.y + (radius + chargeWidth / 2) * Math.sin(orientation);
    const angle = orientation - Math.PI / 2;

    fillRect(xPos, yPos, chargeWidth, charge, angle);
  }

  updateSelf(universe: Universe, timeDeltaMs: DOMHighResTimeStamp) {
    super.updateSelf(universe, timeDeltaMs);

    const attachment = this.planetAttachment;
    if (attachment !== null) {
      // The planet may be rotating so we need to move/orient the player relative to it
      const { planet, orientationOffset } = attachment;

      this.orientation = planet.orientation + orientationOffset;

      const dist = this.radius + planet.radius;
      const { x, y } = vecFromAngleAndScale(this.orientation, dist);

      this.vector.x = planet.vector.x + x;
      this.vector.y = planet.vector.y + y;

      this.vector.dx = 0;
      this.vector.dy = 0;
    }
  }

  get isFixed(): boolean {
    return super.isFixed;
  }

  set isFixed(value: boolean) {
    super.isFixed = value;
    if (value === false) {
      this.planetAttachment = null;
    }
  }
}

export interface PlanetOptions extends UniverseCircleOptions {
  isFixed?: true;
}

/** Planets that we jump between, Debris orbits these **/
export class Planet extends UniverseCircle {
  constructor(options: PlanetOptions) {
    super({
      ...options,
      mass: options.mass ?? 30,
      radius: options.radius ?? 30,
      isFixed: true,
    });
  }
}

interface GoalPlanetOptions extends PlanetOptions {
  goalTexture: string;
}

export class GoalPlanet extends Planet {
  goalTexture: string;

  constructor(options: GoalPlanetOptions) {
    super(options);
    this.goalTexture = options.goalTexture;
  }

  draw() {
    super.draw();

    canvasContext.fillStyle = createRadialGradient(
      'transparent',
      this.goalTexture,
      this.vector.x,
      this.vector.y,
      this.radius,
    );
    canvasContext.arc(
      this.vector.x,
      this.vector.y,
      this.radius,
      0,
      2 * Math.PI,
    );
    canvasContext.fill();
  }
}

interface DebrisOptions extends UniverseCollectibleOptions {
  isFixed?: false;

  planet: Planet;
  /** Orbit speed in radians per second */
  orbitSpeed?: number;
  orbitLocation?: number;
  altitude?: number;
}

/** Space Debris floating around our planet to be collected for points **/
export class Debris extends UniverseCollectible {
  planet: Planet;
  /** Orbit speed in radians per second */
  orbitSpeed: number;
  orbitLocation: number;
  altitude: number;
  constructor(options: DebrisOptions) {
    super({
      ...options,
      radius: options.radius ?? 3,
      texture: options.texture ?? '#afa',
      isFixed: false,
    });
    this.planet = options.planet;
    this.orbitSpeed =
      (Math.random() * 0.1 + 0.1) * (Math.random() < 0.5 ? -1 : 1);
    this.orbitLocation = Math.random() * Math.PI * 2;
    this.altitude = Math.random() * 50 + 100;
  }
}

interface AsteroidOptions extends UniverseCircleOptions {
  isFixed?: false;
}

/** Object that hurls through space, potenially colliding with the player **/
export class Asteroid extends UniverseCircle {
  constructor(options: AsteroidOptions) {
    super({
      ...options,
      mass: options.mass ?? 3,
      radius: options.radius ?? 5,
      texture: options.texture ?? '#d55',
      isFixed: false,
    });
  }
}

export interface Universe {
  points: number;
  objects: UniverseObject[];
  targetGoalPoints?: number;
}
