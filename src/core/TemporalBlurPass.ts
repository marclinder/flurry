import {
  WebGLRenderer,
  WebGLRenderTarget,
  ShaderMaterial,
  PlaneGeometry,
  Scene,
  OrthographicCamera,
  Mesh,
  Vector2,
} from 'three';
import { Pass } from 'three/examples/jsm/postprocessing/Pass';

/**
 * TemporalBlurPass blends the current frame with the previous one
 * using a ping-pong buffer, creating a smooth trailing effect.
 */
export class TemporalBlurPass extends Pass {
  private pingPongA: WebGLRenderTarget;
  private pingPongB: WebGLRenderTarget;
  private isAActive: boolean = true;

  private material: ShaderMaterial;
  private scene: Scene;
  private camera: OrthographicCamera;
  private quad: Mesh;

  /**
   * Creates an instance of TemporalBlurPass.
   * @param {number} width
   * @param {number} height
   * @param {number} [mixRatio=0.85]
   * @memberof TemporalBlurPass
   */
  constructor(width: number, height: number, mixRatio = 0.85) {
    super();

    const options = {
      depthBuffer: false,
      stencilBuffer: false,
    };

    this.pingPongA = new WebGLRenderTarget(width, height, options);
    this.pingPongB = new WebGLRenderTarget(width, height, options);

    this.material = new ShaderMaterial({
      uniforms: {
        tCurrent: { value: null },
        tPrevious: { value: null },
        mixRatio: { value: mixRatio },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tCurrent;
        uniform sampler2D tPrevious;
        uniform float mixRatio;
        varying vec2 vUv;

        void main() {
          vec4 curr = texture2D(tCurrent, vUv);
          vec4 prev = texture2D(tPrevious, vUv);
          gl_FragColor = mix(curr, prev, mixRatio);
        }
      `,
    });

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new Scene();
    this.quad = new Mesh(new PlaneGeometry(2, 2), this.material);
    this.scene.add(this.quad);
  }

  
  /**
   *  Internal: checks if the A buffer is currently active
   *
   * @readonly
   * @private
   * @type {WebGLRenderTarget}
   * @memberof TemporalBlurPass
   */
  private get readBuffer(): WebGLRenderTarget {
    return this.isAActive ? this.pingPongA : this.pingPongB;
  }

  /**
   * Internal: gets the current write buffer
   *
   * @readonly
   * @private
   * @type {WebGLRenderTarget}
   * @memberof TemporalBlurPass
   */
  private get writeBuffer(): WebGLRenderTarget {
    return this.isAActive ? this.pingPongB : this.pingPongA;
  }

  /**
   * Renders the TemporalBlurPass effect.
   *
   * @memberof TemporalBlurPass
   */
  override render(
    renderer: WebGLRenderer,
    writeBuffer: WebGLRenderTarget,
    readBuffer: WebGLRenderTarget
  ): void {
    this.material.uniforms.tCurrent.value = readBuffer.texture;
    this.material.uniforms.tPrevious.value = this.readBuffer.texture;

    // Render blended result to writeBuffer or screen
    const outputTarget = this.renderToScreen ? null : writeBuffer;
    renderer.setRenderTarget(outputTarget);
    renderer.clear();
    renderer.render(this.scene, this.camera);

    // Copy result into ping-pong write buffer
    renderer.setRenderTarget(this.writeBuffer);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(null);

    this.isAActive = !this.isAActive;
  }

  /**
   * Sets the size of the render targets used by the TemporalBlurPass.
   *
   * @memberof TemporalBlurPass
   */
  override setSize(width: number, height: number): void {
    this.pingPongA.setSize(width, height);
    this.pingPongB.setSize(width, height);
  }

  /**
   * Disposes the TemporalBlurPass resources.
   *
   * @memberof TemporalBlurPass
   */
  override dispose(): void {
    this.pingPongA.dispose();
    this.pingPongB.dispose();
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
