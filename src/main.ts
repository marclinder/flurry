import Stats from 'stats.js';
import { Flurry } from './core/Flurry';
import { config } from './config';

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const particleSystem = new Flurry(stats);