import { BACKGROUND_COLOR, canvasContext, Point } from './canvas';
import { vec, vecDistance } from './vector';

export class Background {
  timeOffset: number;
  starColor: string;
  starPixelSize: number;
  animationFrameDurationMs: number;
  stars: [x: number, y: number][];
  constructor() {
    this.timeOffset = 0;
    this.starColor = '#888';
    this.starPixelSize = 3;
    this.animationFrameDurationMs = 200;

    const stars: [number, number][] = [rand()];

    function rand() {
      return [Math.random() * 2000, Math.random() * 2000] as Point;
    }

    function distance(a: Point, b: Point) {
      return vecDistance(vec(...a), vec(...b));
    }

    function closest(vec: Point) {
      let bestDist = Infinity;
      let best = null;
      for (const star of stars) {
        if (!best) {
          best = star;
          bestDist = distance(star, vec);
          continue;
        }
        const dist = distance(vec, star);
        if (dist < bestDist) {
          best = star;
          bestDist = dist;
        }
      }
      return best!;
    }

    function sample() {
      let bestCandidate: Point;
      let bestDistance = 0;
      for (let i = 0; i < 10; ++i) {
        const c = rand();
        const d = distance(closest(c), c);
        if (d > bestDistance) {
          bestDistance = d;
          bestCandidate = c;
        }
      }
      return bestCandidate!;
    }

    for (let i = 1; i < 100; ++i) {
      stars.push(sample());
    }
    this.stars = stars;
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
