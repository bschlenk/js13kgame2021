import { Debris } from './universe';

export function updateDebris(item: Debris, timeDeltaMs: number) {
  item.orbitLocation += item.orbitSpeed * (timeDeltaMs / 1000);
  item.pos.x = item.altitude * Math.cos(item.orbitLocation) + item.planet.pos.x;
  item.pos.y = item.altitude * Math.sin(item.orbitLocation) + item.planet.pos.y;
}
