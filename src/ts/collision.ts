import { UniverseCircle } from './universe';

export function doCirclesIntersect(
  a: UniverseCircle,
  b: UniverseCircle,
): boolean {
  const maxDistance = a.radius + b.radius;
  return (
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) < maxDistance
  );
}
