const canvas = document.getElementsByTagName('canvas')[0];
const canvasContext = canvas.getContext('2d')!;

const BACKGROUND_COLOR = '#121212';

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function clearCanvas() {
  canvasContext.fillStyle = BACKGROUND_COLOR;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Creates a gradient
 */
function createVerticalGradient(
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

export {
  canvas,
  canvasContext,
  resizeCanvas,
  createVerticalGradient,
  clearCanvas,
  BACKGROUND_COLOR,
};
