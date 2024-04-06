import {tonumber} from './Numbers.js';

export interface ISize {
  width: number;
  height: number;
}

export default class Size implements ISize {
  width: number;
  height: number;

  constructor ();
  constructor (width: number, height: number);
  constructor (width?: number, height?: number) {
    this.width = tonumber(width);
    this.height = tonumber(height);
  }

  reset (): void {
    this.width = NaN;
    this.height = NaN;
  }

  setSize (width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}
