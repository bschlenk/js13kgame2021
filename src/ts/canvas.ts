const canvas = document.getElementsByTagName('canvas')[0];
const canvasContext = canvas.getContext('2d')!;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function clearCanvas() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

export { canvas, canvasContext, resizeCanvas, clearCanvas };
