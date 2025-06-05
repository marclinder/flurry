import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ThreeScene } from './ThreeScene';


/**
 * Flurry class manages a system of particles, rendering them using PixiJS.
 *
 * @export
 * @class Flurry
 */
export class Flurry {
  private scene: ThreeScene;

  /**
   * Creates an instance of Flurry.
   * @param {Stats} stats
   * @memberof ParticleSystem
   */
  constructor(stats: Stats) {
    this.scene = new ThreeScene(stats, this.update.bind(this));
  }


  /**
   *  Updates the particle system.
   *
   * @memberof ParticleSystem
   */
  private update() {
    // Update logic for particles goes here
  }


}
