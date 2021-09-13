import {
  canvasContext,
  createLinearGradient,
  createRadialGradient,
  fillPath,
} from './canvas';
import { vec, vecFromAngleAndScale, Vector } from './vector';

/** The texture to render as. This may become a more complicated type union in the future */
export type Texture = string;

export interface UniverseObjectOptions {
  x: number;
  y: number;
  velocity?: Vector;
  isFixed?: boolean;
}

/** The most basic building block of objects in the universe */
export class UniverseObject {
  position: Vector;
  velocity?: Vector;
  #isFixed: boolean;

  constructor(options: UniverseObjectOptions) {
    this.position = vec(options.x, options.y);
    this.velocity = options.velocity;
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
      this.position.x,
      this.position.y,
      this.radius * 2,
      this.radius * 2,
      this.orientation,
    );
    canvasContext.arc(
      this.position.x,
      this.position.y,
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

    const { position, jumpCharge: charge, radius, orientation } = this;

    if (!charge) return;

    canvasContext.save();

    canvasContext.fillStyle = '#e43';
    canvasContext.translate(position.x, position.y);
    canvasContext.rotate(orientation - Math.PI / 2);

    const chargeWidth = radius;
    const halfChargeWidth = chargeWidth / 2;
    const xPos = -halfChargeWidth;
    const yPos = radius + halfChargeWidth + charge;

    canvasContext.fillRect(xPos, yPos, chargeWidth, -charge);
    fillPath(
      [xPos, yPos],
      [xPos + chargeWidth, yPos],
      [0, yPos + halfChargeWidth],
    );

    canvasContext.restore();
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

      this.position.x = planet.position.x + x;
      this.position.y = planet.position.y + y;

      this.velocity = vec(0, 0);
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
      this.position.x,
      this.position.y,
      this.radius,
    );
    canvasContext.arc(
      this.position.x,
      this.position.y,
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

  updateSelf(universe: Universe, timeDeltaMs: DOMHighResTimeStamp) {
    super.updateSelf(universe, timeDeltaMs);

    this.orbitLocation += this.orbitSpeed * (timeDeltaMs / 1000);
    this.position.x =
      this.altitude * Math.cos(this.orbitLocation) + this.planet.position.x;
    this.position.y =
      this.altitude * Math.sin(this.orbitLocation) + this.planet.position.y;
  }
}

export interface AsteroidOptions extends UniverseCircleOptions {
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

export interface UniverseTextOptions extends UniverseObjectOptions {
  fontSize: number;
  text: string;
}

export class UniverseText extends UniverseObject {
  fontSize?: number;
  text: string;

  constructor(options: UniverseTextOptions) {
    super(options);
    this.fontSize = options.fontSize ?? 12;
    this.text = options.text;
  }

  draw() {
    super.draw();
    canvasContext.fillStyle = '#EEE';
    canvasContext.font = `${this.fontSize}px sans-serif`;
    const textWidth = canvasContext.measureText(this.text).width;
    canvasContext.fillText(
      this.text,
      this.position.x - textWidth / 2,
      this.position.y,
    );
  }
}

export interface Universe {
  points: number;
  objects: UniverseObject[];
  targetGoalPoints?: number;
}
