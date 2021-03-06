export const canvas = document.getElementsByTagName('canvas')[0];
export const canvasContext = canvas.getContext('2d')!;

export const BACKGROUND_COLOR = '#121212';

export function clearCanvas() {
  canvasContext.fillStyle = BACKGROUND_COLOR;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

export function fillRect(
  x: number,
  y: number,
  width: number,
  height: number,
  angleRadians: number,
) {
  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.rotate(angleRadians);
  canvasContext.translate(-x, -y);
  canvasContext.fillRect(x, y, width, height);
  canvasContext.restore();
}

/**
 * Creates a gradient
 */
export function createLinearGradient(
  fromColor: string,
  toColor: string,
  x: number,
  y: number,
  width: number,
  height: number,
  angle: number,
): CanvasGradient {
  const gradient = canvasContext.createLinearGradient(
    x,
    y,
    x + Math.cos(angle) * width,
    y + Math.sin(angle) * height,
  );
  gradient.addColorStop(0, fromColor);
  gradient.addColorStop(1, toColor);
  return gradient;
}

export function createRadialGradient(
  fromColor: string,
  toColor: string,
  x: number,
  y: number,
  radius: number,
): CanvasGradient {
  const gradient = canvasContext.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, fromColor);
  gradient.addColorStop(1, toColor);
  return gradient;
}

export type Point = [x: number, y: number];

export function fillPath(start: Point, ...points: Point[]) {
  canvasContext.beginPath();
  canvasContext.moveTo(...start);
  points.forEach((p) => {
    canvasContext.lineTo(...p);
  });
  canvasContext.fill();
}
