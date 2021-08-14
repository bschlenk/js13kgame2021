/** The texture to render as. This may become a more complicated type union in the future */
type Texture = string;

/** The most basic building block of objects in the universe */
interface UniverseObject {
  x: number;
  y: number;
}

/** An object with mass, but does not require that it takes up space. E.g. black holes */
interface UniverseObjectWithMass extends UniverseObject {
  mass: number;
  hasGravitationalForce: boolean;
  isFixed: boolean;
  /** Pixels per ms */
  velocity?: {
    dx: number;
    dy: number;
  };
}

/** A circle that exists in the universe.  */
interface UniverseCircle extends UniverseObjectWithMass {
  radius: number;
  texture: Texture;
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
    maybeCircle.texture !== undefined
  );
}

export {
  Texture,
  UniverseObject,
  UniverseObjectWithMass,
  UniverseCircle,
  isUniverseCircle,
  isObjectWithMass,
};
