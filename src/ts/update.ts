import { Debris } from './universe';

export function updateDebris(item: Debris, timeDeltaMs: number) {
  item.orbitLocation += item.orbitSpeed * (timeDeltaMs / 1000);
  item.vector.x =
    item.altitude * Math.cos(item.orbitLocation) + item.planet.vector.x;
  item.vector.y =
    item.altitude * Math.sin(item.orbitLocation) + item.planet.vector.y;
}
