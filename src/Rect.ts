import type {ISize} from './Size.js';
import {tonumber} from './Numbers.js';
import Position from './Position.js';

export default class Rect extends Position implements ISize {
  width: number;
  height: number;

  constructor ();
  constructor (x: number, y: number, width: number, height: number);
  constructor (x?: number, y?: number, width?: number, height?: number) {
    super(x!, y!);
    this.width = tonumber(width);
    this.height = tonumber(height);
  }

  reset () {
    super.reset();
    this.width = NaN;
    this.height = NaN;
  }

  fromSize (size: ISize): void {
    this.width = size.width;
    this.height = size.height;
  }
}
