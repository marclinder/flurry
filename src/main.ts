import Stats from 'stats.js';
import { Flurry } from './core/Flurry';

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const particleSystem = new Flurry(stats);