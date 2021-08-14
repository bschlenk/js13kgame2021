import { resizeCanvas } from './canvas';
import { onRequestAnimationFrame, pauseGame } from './game';

/**
 * Do one-time setup work here
 */
function bootstrap() {
  const requestAnimationFrameCallback = (time: DOMHighResTimeStamp) => {
    onRequestAnimationFrame(time);
    requestAnimationFrame(requestAnimationFrameCallback);
  };
  requestAnimationFrame(requestAnimationFrameCallback);

  addEventListener('blur', pauseGame);
  addEventListener('resize', resizeCanvas);
  resizeCanvas();
}

export { bootstrap };
