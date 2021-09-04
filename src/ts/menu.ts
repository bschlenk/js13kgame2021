import { canvas, canvasContext, clearCanvas } from './canvas';

export function renderPauseMenu() {
  clearCanvas();
  canvasContext.fillStyle = '#222';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  drawCenterText('Planet Hoppers', 6, 150);
  drawCenterText('Press Space to Resume', 3, 300);
}

function drawCenterText(text: string, size: number, yOffset: number) {
  canvasContext.strokeStyle = '#eee';
  canvasContext.font = `${size}em sans-serif`;
  const middleCanvas = canvas.width / 2;
  const textWidth = canvasContext.measureText(text).width;
  canvasContext.strokeText(text, middleCanvas - textWidth / 2, yOffset);
}
