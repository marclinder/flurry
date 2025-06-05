import * as THREE from 'three';

/**
 * Represents a single particle in the particle system.
 * @export
 * @class Particle
 */
export class Particle {

  private history: THREE.Vector3[] = [];
  private direction = new THREE.Vector3();
  private theta = new THREE.Vector3();
  private mesh: THREE.Line;
  private speed = 0.02;
  private maxHistory = 60;
  private color: THREE.Color;

  constructor(private scene: THREE.Scene) {
    this.color = new THREE.Color().setHSL(Math.random(), 1.0, 0.5);

    // Initial position and random theta
    const start = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
    this.history.push(start.clone());

    this.theta.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    // Line setup
    const geometry = new THREE.BufferGeometry().setFromPoints(this.history);
    const material = new THREE.LineBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Line(geometry, material);
    this.scene.add(this.mesh);
  }

  update(deltaTime: number) {
    const lastPos = this.history[this.history.length - 1].clone();

    // Update theta for smooth swirling motion
    this.theta.x += 0.01 + Math.random() * 0.005;
    this.theta.y += 0.012 + Math.random() * 0.005;
    this.theta.z += 0.008 + Math.random() * 0.005;

    const dir = new THREE.Vector3(
      Math.sin(this.theta.x),
      Math.sin(this.theta.y),
      Math.sin(this.theta.z)
    ).normalize();

    const newPos = lastPos.clone().add(dir.multiplyScalar(this.speed));
    this.history.push(newPos);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.BufferGeometry().setFromPoints(this.history);
  }

}
