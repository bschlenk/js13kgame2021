import { Debris } from './universe';

export function updateDebris(item: Debris, timeDeltaMs: number) {
  item.orbitLocation += item.orbitSpeed * (timeDeltaMs / 1000);
  item.position.x =
    item.altitude * Math.cos(item.orbitLocation) + item.planet.position.x;
  item.position.y =
    item.altitude * Math.sin(item.orbitLocation) + item.planet.position.y;
}
