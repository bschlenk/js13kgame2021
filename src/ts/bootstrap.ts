import { onKeyDown, onKeyUp, onRequestAnimationFrame, pauseGame } from './game';

/**
 * Do one-time setup work here
 */
export function bootstrap() {
  const requestAnimationFrameCallback = (time: DOMHighResTimeStamp) => {
    onRequestAnimationFrame(time);
    requestAnimationFrame(requestAnimationFrameCallback);
  };
  requestAnimationFrame(requestAnimationFrameCallback);

  addEventListener('blur', pauseGame);
  addEventListener('keydown', onKeyDown);
  addEventListener('keyup', onKeyUp);
}
