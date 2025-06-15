import * as THREE from 'three';
import { Sprite, Texture } from 'three';

/**
 * Represents a single particle in the particle system.
 * @export
 * @class Particle
 */
export class Particle {
  private static texture: Texture;
  private sprite: Sprite<THREE.Object3DEventMap>;

  constructor(private scene: THREE.Scene) {
    if (!Particle.texture)
      Particle.texture = this.createParticleTexture();

    const spriteMaterial = new THREE.SpriteMaterial({ map: Particle.texture });
    this.sprite = new THREE.Sprite(spriteMaterial);
    this.scene.add(this.sprite);
  }

  
  update(deltaTime: number) {

  }

  /**
   * Creates a texture for the particle with gradient fill.
   *
   * @private
   * @return {*}  {Texture}
   * @memberof Particle
   */
  private createParticleTexture(): Texture {
    const radius = 50;
    const size = radius * 4;
    const center = size / 2;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;

    // Create smooth radial gradient: center = opaque, edge = transparent
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size); // fill full canvas with gradient

    return new THREE.CanvasTexture(canvas);
  }

}
