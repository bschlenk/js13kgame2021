import { UniverseCollectible } from './universe';

export function updateCollectible(
  item: UniverseCollectible,
  timeDeltaMs: number,
) {
  item.orbitLocation += item.orbitSpeed * (timeDeltaMs / 1000);
  item.x = item.altitude * Math.cos(item.orbitLocation) + item.originX;
  item.y = item.altitude * Math.sin(item.orbitLocation) + item.originY;
}
