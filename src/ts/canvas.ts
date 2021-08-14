const canvas = document.getElementsByTagName('canvas')[0];
const canvasContext = canvas.getContext('2d')!;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export { canvas, canvasContext, resizeCanvas };
