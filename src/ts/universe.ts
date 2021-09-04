import {
  canvasContext,
  createLinearGradient,
  createRadialGradient,
  fillRect,
} from './canvas';

/** The texture to render as. This may become a more complicated type union in the future */
export type Texture = string;

export interface Vector {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

/** The most basic building block of objects in the universe */
export class UniverseObject {
  vector: Vector;
  isFixed: boolean;

  constructor(x: number, y: number) {
    this.vector = { x, y, dx: 0, dy: 0 };
    this.isFixed = true;
  }

  /** Draws the object to the screen */
  draw() {
    // Base implementation does nothing
  }
}

/** An object with mass, but does not require that it takes up space. E.g. black holes */
export class UniverseObjectWithMass extends UniverseObject {
  mass: number;

  constructor(x: number, y: number) {
    super(x, y);
    this.mass = 0;
  }
}

/** A circle that exists in the universe.  */
export class UniverseCircle extends UniverseObjectWithMass {
  radius: number;
  texture: Texture;
  /** Rotation of object in radians */
  orientation: number;

  constructor(x: number, y: number) {
    super(x, y);
    this.radius = 10;
    this.texture = '#fff';
    this.orientation = 0;
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
}

/** An item the player can collect for points **/
export class UniverseCollectible extends UniverseCircle {
  points: number;

  constructor(x: number, y: number) {
    super(x, y);
    this.points = 1;
  }
}

/** The user-controllable player, jumps between planets **/
export class UniversePlayer extends UniverseCircle {
  jumpCharge: number;
  jumpChargeDirection: 1 | -1;

  constructor(x: number, y: number) {
    super(x, y);
    this.radius = 10;
    this.texture = '#fff';
    this.jumpChargeDirection = 1;
    this.jumpCharge = 0;
    this.mass = 40;
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
}

/** Planets that we jump between, Debris orbits these **/
export class Planet extends UniverseCircle {
  constructor(x: number, y: number, texture: Texture) {
    super(x, y);
    this.texture = texture;
    this.radius = 30;
    this.mass = 30;
  }
}

export class GoalPlanet extends Planet {
  goalTexture: string;

  constructor(
    x: number,
    y: number,
    planetTexture: Texture,
    goalTexture: Texture,
  ) {
    super(x, y, planetTexture);
    this.goalTexture = goalTexture;
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

/** Space Debris floating around our planet to be collected for points **/
export class Debris extends UniverseCollectible {
  planet: Planet;
  orbitSpeed: number;
  orbitLocation: number;
  altitude: number;
  constructor(planet: Planet) {
    super(1, 1);
    this.radius = 3;
    this.planet = planet;
    this.orbitSpeed =
      (Math.random() * 0.1 + 0.1) * (Math.random() < 0.5 ? -1 : 1);
    this.orbitLocation = Math.random() * Math.PI * 2;
    this.altitude = Math.random() * 50 + 100;
    this.texture = '#afa';
    this.isFixed = false;
  }
}

/** Object that hurls through space, potenially colliding with the player **/
export class Asteroid extends UniverseCircle {
  constructor(x: number, y: number) {
    super(x, y);
    this.mass = 3;
    this.radius = 5;
    this.texture = '#d55';
    this.isFixed = false;
  }
}

export interface Universe {
  points: number;
  objects: UniverseObject[];
}
