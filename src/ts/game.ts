import { canvas, canvasContext } from './canvas';

function onRequestAnimationFrame(_time: DOMHighResTimeStamp) {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = '#333';
  canvasContext.strokeStyle = '#333';
  canvasContext.strokeText('hello', Math.random() * 100, 100);
}

function pauseGame() {
  // Pause?
}

export { onRequestAnimationFrame, pauseGame };
