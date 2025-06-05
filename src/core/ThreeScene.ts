import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * ThreeScene - core class that creates a 3D scene using Three.js
 * and exposes the scene, camera, and renderer.
 * 
 * Really just a wrapper around Three.js to make it easier to use.
 *
 * @export
 * @class ThreeScene
 */
export class ThreeScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  /**
   * Creates an instance of ThreeScene.
   * @param {Stats} stats
   * @memberof ParticleSystem
   */
  constructor(private stats: Stats, private updateCallback: () => void) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.update.bind(this));

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // helpers
    this.createHelpers();
    this.createTestGeom();
  }

  /**
   * Creates various helpers for the scene, such as a grid helper and a cube.
   *
   * @private
   * @memberof ThreeScene
   */
  private createHelpers() {
    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);
    this.scene.add(gridHelper);
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  /**
   * Creates a test geometry for visualization purposes.
   *
   * @private
   * @memberof ThreeScene
   */
  private createTestGeom() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    this.camera.position.z = 5;
  }

  /**
   *  Updates the particle system.
   *
   * @memberof ParticleSystem
   */
  public update() {
    this.stats.begin();
    const cube = this.scene.children.find(child => child instanceof THREE.Mesh && (child as THREE.Mesh).geometry instanceof THREE.BoxGeometry) as THREE.Mesh;
    if (cube) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }
    this.renderer.render(this.scene, this.camera);
    this.updateCallback();
    this.stats.end();
  }


  /**
   * Handles window resize events to adjust camera and renderer settings.
   *
   * @private
   * @memberof ThreeScene
   */
  private onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, true); // false = don't update canvas style
  }

}
