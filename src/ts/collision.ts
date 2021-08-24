import { UniverseCircle } from './universe';
import { vecDistance } from './utils';

export function doCirclesIntersect(
  a: UniverseCircle,
  b: UniverseCircle,
): boolean {
  const maxDistance = a.radius + b.radius;
  return vecDistance(a, b) < maxDistance;
}
