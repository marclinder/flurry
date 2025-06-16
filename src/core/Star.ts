import * as THREE from 'three';
import { Group } from 'three';
import { Stream } from './Stream';

/**
 * Star manages a flowing trail of animated particles.
 *
 * @export
 * @class Star
 */
export class Star {
  private children = new Group();
  public streams: Stream[] = [];

  /**
   * Creates an instance of Star.
   * @param {THREE.Scene} scene
   * @memberof Star
   */
  constructor(private scene: THREE.Scene) {
    this.scene.add(this.children);

    const NUM_STREAMS = 6;
    for (let i = 0; i < NUM_STREAMS; i++) {
      const stream = new Stream(this.children);
      this.streams.push(stream);
    }
  }

  /**
   * Updates all particles in the Star.
   *
   * @param {number} deltaTime
   * @memberof Star
   */
  update(deltaTime: number) {
    this.streams.forEach(s => s.update(deltaTime));
  }

}