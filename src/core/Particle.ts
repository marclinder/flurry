import * as THREE from 'three';
import { Object3D, Sprite, Texture, Vector3 } from 'three';
import { config } from '../config';
import { smoothstep } from '../utils';
import { createNoise2D } from 'simplex-noise';

/**
 * Represents a single particle in the particle system.
 * @export
 * @class Particle
 */
export class Particle {
  private static texture: Texture;
  private static totalParticles = 0;
  private static noise = createNoise2D();

  private sprite: Sprite;
  private velocity: Vector3;
  private index = 0;
  private age = 0;
  private lifespan = 100;

  constructor(private container: Object3D) {
    if (!Particle.texture)
      Particle.texture = this.createParticleTexture();

    const spriteMaterial = new THREE.SpriteMaterial({
      map: Particle.texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    this.sprite = new THREE.Sprite(spriteMaterial);
    this.sprite.scale.setScalar(.4); // Set scale to make the particle visible
    this.velocity = new Vector3(0, 0, 0);
    this.container.add(this.sprite);
    this.index = Particle.totalParticles++;
  }

  /**
   * Updates the particle's position and appearance.
   *
   * @memberof Particle
   */
  public update() {
    const angle = this.index / 500;

    const noiseStrength = config.noiseStrength;
    this.velocity.x = Particle.noise(angle, angle) * noiseStrength;
    this.velocity.y = Particle.noise(angle, angle) * noiseStrength;
    this.velocity.z = Math.cos(angle) * noiseStrength;
    // this.velocity.x = Math.cos(angle) * config.noiseStrength;
    // this.velocity.y = Math.sin(angle) * config.noiseStrength;
    // this.velocity.z = Math.cos(angle) * config.noiseStrength;
    this.index += 0.00001;

    this.sprite.position.addScaledVector(this.velocity, 1); // Scale velocity by deltaTime

    this.age += 1;
    const ageNormalised = this.age / this.lifespan; // Normalize age to [0, 1]
    const color = this.getFlurryColor(ageNormalised);
    this.sprite.material.color.set(color);

    const fade = 1.0 - smoothstep(0.6, 1.0, ageNormalised);
    this.sprite.material.opacity = fade;
  }

  /**
   * Destroys the particle, cleaning up resources.
   * @memberof Particle
   */
  public destroy() {
    this.sprite.material.dispose();
    this.container.remove(this.sprite);
    this.sprite = null as any; // Clear reference to allow garbage collection
  }

  /**
   * Checks if the particle is dead based on its age and lifespan.
   * @return {*}  {boolean}
   * @memberof Particle
   */
  public isDead(): boolean {
    return this.age >= this.lifespan;
  }

  /**
   * Creates a texture for the particle with gradient fill.
   * @private
   * @return {*}  {Texture}
   * @memberof Particle
   */
  private createParticleTexture(): Texture {
    const radius = 10;
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

  /**
   * Returns a vivid rainbow-like color based on t in [0, 1],
   * mimicking the Apple "Flurry" screensaver palette.
   */
  private getFlurryColor(t: number): THREE.Color {
    // const hue = (t % 1) * 360 + (Particle.totalParticles * .03); // hue cycles from 0 to 360
    const hue = (t % 1) * 360;
    const saturation = 1.0;
    const lightness = 0.5;
    const color = new THREE.Color();
    color.setHSL(hue / 360, saturation, lightness);

    return color;
  }

}
