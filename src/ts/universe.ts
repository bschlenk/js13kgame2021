/** The texture to render as. This may become a more complicated type union in the future */
type Texture = string;

/** The most basic building block of objects in the universe */
interface UniverseObject {
  x: number;
  y: number;
  type: string;
}

interface Velocity {
  dx: number;
  dy: number;
}

/** An object with mass, but does not require that it takes up space. E.g. black holes */
interface UniverseObjectWithMass extends UniverseObject {
  mass: number;
  hasGravitationalForce: boolean;
  isFixed: boolean;
  /** Pixels per ms */
  velocity?: Velocity;
}

/** A circle that exists in the universe.  */
interface UniverseCircle extends UniverseObjectWithMass {
  radius: number;
  texture: Texture;
  /** Rotation of object in radians */
  orientation: number;
}

interface UniverseCollectible extends UniverseCircle {
  points: number;
  originX: number;
  originY: number;
  orbitSpeed: number; // Radians/sec
  orbitLocation: number; // Radians
  altitude: number;
}

interface UniversePlayer extends UniverseCircle {
  isPlayer: true;
  jumpCharge: number;
  jumpChargeDirection: 1 | -1;
  velocity: Velocity;
}

function isObjectWithMass(
  universeObject: UniverseObject,
): universeObject is UniverseObjectWithMass {
  const maybeHasMass = universeObject as UniverseObjectWithMass;
  return (
    maybeHasMass.mass !== undefined &&
    maybeHasMass.hasGravitationalForce !== undefined &&
    maybeHasMass.isFixed !== undefined
  );
}

function isUniverseCircle(
  universeObject: UniverseObject,
): universeObject is UniverseCircle {
  const maybeCircle = universeObject as UniverseCircle;
  return (
    isObjectWithMass(universeObject) &&
    maybeCircle.radius !== undefined &&
    maybeCircle.texture !== undefined &&
    maybeCircle.orientation !== undefined
  );
}

function isCollectible(
  universeObject: UniverseObject,
): universeObject is UniverseCollectible {
  return universeObject.type === 'collectible';
}

function isPlayer(
  universeObject: UniverseObject,
): universeObject is UniversePlayer {
  const maybePlayer = universeObject as UniversePlayer;
  return maybePlayer.isPlayer;
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
  Universe,
  Texture,
  UniverseObject,
  UniverseObjectWithMass,
  UniverseCircle,
  UniversePlayer,
  UniverseCollectible,
  isCollectible,
  isUniverseCircle,
  isObjectWithMass,
  isPlayer,
};
