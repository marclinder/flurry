import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ThreeScene } from './ThreeScene';
import { Particle } from './Particle';


/**
 * Flurry class manages a system of particles, rendering them using PixiJS.
 *
 * @export
 * @class Flurry
 */
export class Flurry {
  private scene: ThreeScene;
  private particles: Particle[] = [];

  /**
   * Creates an instance of Flurry.
   * @param {Stats} stats
   * @memberof ParticleSystem
   */
  constructor(stats: Stats) {
    this.scene = new ThreeScene(stats, this.update.bind(this));
    this.scene.createHelpers();
    // this.scene.createTestGeom();

    for (let i = 0; i < 1; i++) {
      this.particles.push(new Particle(this.scene.scene));
    }
  }


  /**
   *  Updates the particle system.
   *
   * @memberof ParticleSystem
   */
  private update() {
    // Update logic for particles goes here
    const clock = new THREE.Clock();
    const delta = clock.getDelta();

    this.particles.forEach(p => p.update(delta));
  }


}
