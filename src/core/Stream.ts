import * as THREE from 'three';
import { Group, Object3D } from 'three';
import { Particle } from './Particle';

/**
 * Stream manages a flowing trail of animated particles.
 *
 * @export
 * @class Stream
 */
export class Stream {

    private particlesContainer = new Group();
    private particles: Particle[] = [];

    /**
     * Creates an instance of Stream.
     * @param {THREE.Scene} scene
     * @memberof Stream
     */
    constructor(private container: Object3D) {
        this.container.add(this.particlesContainer);
        this.particlesContainer.rotateX(Math.random() * Math.PI * 2);
        this.particlesContainer.rotateY(Math.random() * Math.PI * 2);
    }

    /**
     * Updates all particles in the stream.
     *
     * @memberof Stream
     */
    public update() {
        const particle = new Particle(this.particlesContainer);
        this.particles.push(particle);
    
        for (const particle of this.particles) {
            particle.update();

            if( particle.isDead()) {
                // TODO use object pool instead of creating and destroying particles
                const index = this.particles.indexOf(particle);
                if (index > -1) {
                    this.particles.splice(index, 1);
                }
                particle.destroy();
            }
        }
    }

}