import {
  Asteroid,
  AsteroidOptions,
  Universe,
  UniverseObject,
  UniverseObjectOptions,
} from '../universe';
import { vec } from '../vector';

export interface AsteroidSpawnerOptions extends UniverseObjectOptions {
  spawnRatePerSecond: number;
  spawnDirection: number;
  spawnSpeed?: number;
}

/** The most basic building block of objects in the universe */
export class AsteroidSpawner extends UniverseObject {
  spawnAfterMs: number;
  /** Direction, in radians spawned asteroids should go */
  spawnDirection: number;
  /** The speed of asteroids upon creation, in pixels per millisecond */
  spawnSpeed: number;
  #timeSinceLastSpawnMs: number;
  #asteroidOptions: AsteroidOptions | undefined;

  constructor(
    options: AsteroidSpawnerOptions,
    asteroidOptions?: AsteroidOptions,
  ) {
    super(options);
    this.spawnAfterMs = 1000 / options.spawnRatePerSecond;
    this.spawnDirection = options.spawnDirection;
    this.spawnSpeed = options.spawnSpeed ?? 0.1;
    this.#timeSinceLastSpawnMs = 0;
    this.#asteroidOptions = asteroidOptions;
  }

  /**
   * Run physics engine for self
   */
  updateSelf(universe: Universe, timeDeltaMs: DOMHighResTimeStamp) {
    super.updateSelf(universe, timeDeltaMs);
    const { position, spawnAfterMs, spawnSpeed, spawnDirection } = this;
    this.#timeSinceLastSpawnMs += timeDeltaMs;
    // console.log(this.#timeSinceLastSpawnMs);

    while (this.#timeSinceLastSpawnMs > spawnAfterMs) {
      console.log('spawning');
      this.#timeSinceLastSpawnMs -= spawnAfterMs;
      const dx = spawnSpeed * Math.cos(spawnDirection);
      const dy = spawnSpeed * Math.sin(spawnDirection);
      universe.objects.push(
        new Asteroid({
          ...this.#asteroidOptions,
          x: position.x,
          y: position.y,
          velocity: vec(dx, dy),
        }),
      );
    }
  }
}
