import { Star } from './Star';
import { ThreeScene } from './ThreeScene';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader';
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader';
import { TemporalBlurPass } from './TemporalBlurPass';

/**
 * Flurry class manages a system of particles, rendering them using PixiJS.
 *
 * @export
 * @class Flurry
 */
export class Flurry {
  private scene: ThreeScene;
  private star: Star;
  composer: any;

  /**
   * Creates an instance of Flurry.
   * @param {Stats} stats
   * @memberof ParticleSystem
   */
  constructor(private stats: Stats) {
    this.scene = new ThreeScene(this.update.bind(this));
    this.scene.createHelpers();
    this.star = new Star(this.scene.scene);

    this.composer = new EffectComposer(this.scene.renderer);
    this.composer.addPass(new RenderPass(this.scene.scene, this.scene.camera));

    // const hblur = new ShaderPass(HorizontalBlurShader);
    // this.composer.addPass(hblur);
    // hblur.renderToScreen = true;

    // const vblur = new ShaderPass(VerticalBlurShader);
    // // set this shader pass to render to screen so we can see the effects
    // vblur.renderToScreen = true;
    // this.composer.addPass(vblur);
    // this.composer.addPass(new ShaderPass(VerticalBlurShader));

    const temporalBlurPass = new TemporalBlurPass(window.innerWidth, window.innerHeight, 0.95);
    temporalBlurPass.renderToScreen = true;
    this.composer.addPass(temporalBlurPass);

  }

  /**
   *  Updates the particle system.
   *
   * @memberof ParticleSystem
   */
  private update() {
    this.stats.begin();
    // Update logic for particles goes here
    const delta = this.scene.clock.getDelta();
    this.composer.render();

    this.star.update(delta);
    this.stats.end();
  }

}
