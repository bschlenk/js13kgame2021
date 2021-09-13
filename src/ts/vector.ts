export interface Vector {
  x: number;
  y: number;
}

export function vec(x: number, y: number) {
  return { x, y };
}

export function vecDistance(a: Vector, b: Vector) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function vecAngle(x: number, y: number) {
  return Math.atan2(y, x);
}

export function vecAngleBetween(a: Vector, b: Vector) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return vecAngle(dx, dy);
}

export function vecFromAngleAndScale(radians: number, scale = 1) {
  return vec(Math.cos(radians) * scale, Math.sin(radians) * scale);
}

export function vecEquals(a: Vector, b: Vector): boolean {
  return a.x === b.x && a.y === b.y;
}
