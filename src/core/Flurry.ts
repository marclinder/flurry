import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { Star } from './Star';
import { TemporalBlurPass } from './TemporalBlurPass';
import { ThreeScene } from './ThreeScene';

/**
 * Flurry class manages a system of particles, rendering them using PixiJS.
 *
 * @export
 * @class Flurry
 */
export class Flurry {
  private scene: ThreeScene;
  private star: Star;
  private composer: EffectComposer;

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

    const temporalBlurPass = new TemporalBlurPass(window.innerWidth, window.innerHeight, 0.94);
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
    this.composer.render();

    this.star.update();
    this.stats.end();
  }

}
