/** The texture to render as. This may become a more complicated type union in the future */
type Texture = string;

interface Velocity {
  dx: number;
  dy: number;
}

interface Position {
  x: number;
  y: number;
}

/** The most basic building block of objects in the universe */
class UniverseObject {
  pos: Position;
  isFixed: boolean;

  constructor(x = 1, y = 1) {
    this.pos = { x, y };
    this.isFixed = true;
  }
}

/** An object with mass, but does not require that it takes up space. E.g. black holes */
class UniverseObjectWithMass extends UniverseObject {
  mass: number;
  /** Pixels per ms */
  velocity: Velocity;

  constructor() {
    super();
    this.mass = 0;
    this.velocity = { dx: 0, dy: 0 };
  }
}

/** A circle that exists in the universe.  */
class UniverseCircle extends UniverseObjectWithMass {
  radius: number;
  texture: Texture;
  /** Rotation of object in radians */
  orientation: number;

  constructor() {
    super();
    this.radius = 10;
    this.texture = '#fff';
    this.orientation = 0;
  }
}

/** An item the player can collect for points **/
class UniverseCollectible extends UniverseCircle {
  points: number;

  constructor(x: number, y: number) {
    super();
    this.pos = { x, y };
    this.mass = 0;
    this.isFixed = true;
    this.points = 1;
  }
}

/** The user-controllable player, jumps between planets **/
class UniversePlayer extends UniverseCircle {
  jumpCharge: number;
  jumpChargeDirection: 1 | -1;
  velocity: Velocity;
  planet: Planet | null;

  constructor(x: number, y: number) {
    super();
    this.pos = { x, y };
    this.radius = 10;
    this.texture = '#fff';
    this.isFixed = true;
    this.velocity = { dx: 0, dy: 0 };
    this.jumpChargeDirection = 1;
    this.jumpCharge = 0;
    this.mass = 5;
    this.planet = null;
  }
}

/** Planets that we jump between, Debris orbits these **/
class Planet extends UniverseCircle {
  constructor(x: number, y: number, texture: Texture) {
    super();
    this.pos = { x, y };
    this.texture = texture;
    this.isFixed = true;
    this.radius = 30;
  }
}

/** Space Debris floating around our planet to be collected for points **/
class Debris extends UniverseCollectible {
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
class Asteroid extends UniverseCircle {
  constructor(x: number, y: number) {
    super();
    this.pos = { x, y };
    this.mass = 5;
    this.radius = 5;
    this.texture = '#d55';
    this.isFixed = false;
    this.velocity = { dx: 0.03, dy: -0.03 };
  }
}

interface Universe {
  points: number;
  objects: (
    | UniverseObject
    | UniverseCircle
    | UniversePlayer
    | UniverseCollectible
  )[];
}

export {
  Position,
  Universe,
  Texture,
  UniverseObject,
  UniverseObjectWithMass,
  UniverseCircle,
  UniversePlayer,
  UniverseCollectible,
  Planet,
  Debris,
  Asteroid,
};
