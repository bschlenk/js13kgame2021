import { Position } from './universe';

export function removeFromArray<T>(array: T[], find: T) {
  const index = array.indexOf(find);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export function vecDistance(a: Position, b: Position) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function vecAngle(x: number, y: number) {
  return Math.atan2(y, x);
}

export function vecAngleBetween(a: Position, b: Position) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return vecAngle(dx, dy);
}

export function vecFromAngleAndScale(radians: number, scale = 1) {
  return { x: Math.cos(radians) * scale, y: Math.sin(radians) * scale };
}
