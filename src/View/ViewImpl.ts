import type {Parent} from '../Widget.ts';
import type Model from '../Model.ts';
import Animations from './Animations.js';
import Calculations from './Calculations.js';
import Drawing from './Drawing.js';
import Elements from './Elements.js';
import MouseHandler from './MouseHandler.js';
import StateMachine from './StateMachine/StateMachine.js';
import Updater from './Updater.js';

export default class ViewImpl {
  parent: Parent;
  canvas: HTMLCanvasElement;
  animations: Animations;
  calculations: Calculations;
  drawing: Drawing;
  elements: Elements;
  mouseHandler: MouseHandler;
  stateMachine: StateMachine;
  updater: Updater;
  model: Model | null;

  constructor (parent: Parent,
               canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    this.parent = parent;
    this.canvas = canvas;
    this.animations = new Animations(this);
    this.calculations = new Calculations(this);
    this.drawing = new Drawing(this, ctx);
    this.elements = new Elements(this);
    this.mouseHandler = new MouseHandler(this);
    this.stateMachine = new StateMachine(this);
    this.updater = new Updater(this);
    this.model = null;
  }
}
