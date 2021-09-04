export const canvas = document.getElementsByTagName('canvas')[0];
export const canvasContext = canvas.getContext('2d')!;

export const BACKGROUND_COLOR = '#121212';

export function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

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
  canvasContext.translate(x, y);
  canvasContext.rotate(angleRadians);
  canvasContext.translate(-x, -y);
  canvasContext.fillRect(x, y, width, height);
  restoreCanvasTransformation();
}

function restoreCanvasTransformation(): void {
  canvasContext.setTransform(1, 0, 0, 1, 0, 0);
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
