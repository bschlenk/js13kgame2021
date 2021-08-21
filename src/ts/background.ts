import { BACKGROUND_COLOR, canvasContext } from './canvas';

export class Background {
  timeOffset: number;
  starColor: string;
  starPixelSize: number;
  animationFrameDurationMs: number;
  stars: [x: number, y: number][];
  constructor() {
    this.timeOffset = 0;
    this.starColor = '#ffe';
    this.starPixelSize = 3;
    this.animationFrameDurationMs = 200;
    this.stars = [...Array(100)].map((_) => [
      Math.round(Math.random() * 2000),
      Math.round(Math.random() * 2000),
    ]);
  }

  update(timeDeltaMs: DOMHighResTimeStamp) {
    this.timeOffset += timeDeltaMs;
  }

  render() {
    const starPixelSize = this.starPixelSize;
    const animationFrameDurationMs = this.animationFrameDurationMs;
    let step = Math.round(this.timeOffset / animationFrameDurationMs);
    this.stars.forEach(([x, y]) => {
      step = (step + 1) % 4;
      canvasContext.fillStyle = this.starColor;
      switch (step) {
        // Single pixel in the middle
        case 0: {
          canvasContext.fillRect(x, y, starPixelSize, starPixelSize);
          break;
        }
        // Plus sign
        case 1:
        case 3: {
          canvasContext.fillRect(
            x - starPixelSize,
            y,
            3 * starPixelSize,
            starPixelSize,
          );
          canvasContext.fillRect(
            x,
            y - starPixelSize,
            starPixelSize,
            3 * starPixelSize,
          );
          break;
        }
        // Plus sign with whole in the middle
        case 2: {
          canvasContext.fillRect(
            x - starPixelSize,
            y,
            3 * starPixelSize,
            starPixelSize,
          );
          canvasContext.fillRect(
            x,
            y - starPixelSize,
            starPixelSize,
            3 * starPixelSize,
          );
          canvasContext.fillStyle = BACKGROUND_COLOR;
          canvasContext.fillRect(x, y, starPixelSize, starPixelSize);
          break;
        }
      }
    });
  }
}
