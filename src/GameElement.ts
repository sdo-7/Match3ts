import type {IPosition} from './Position.ts';
import {tonumber} from './Numbers.js';
import Position, {posEqual, posToPrimitive} from './Position.js';

export type Value = null | number;

export type GameElementGenerator = Generator<GameElement, undefined, undefined>;

export default class GameElement implements IPosition {
  private _alpha: number;
  private _origCanvasPos: Position;
  private _canvasPos: Position;

  constructor (private _x: number,
               private _y: number,
               private _data: Value[],
               private _offset: number) {
    this._alpha = NaN;
    this._origCanvasPos = new Position();
    this._canvasPos = new Position();
  }

  get x () {
    return this._x;
  }

  get y () {
    return this._y;
  }

  get value () {
    const value = this._data[this._offset];
    return value;
  }

  get alpha () {
    return this._alpha;
  }

  set alpha (value: number) {
    this._alpha = tonumber(value);
  }

  get origCanvasPos () {
    return this._origCanvasPos;
  }

  get canvasPos () {
    return this._canvasPos;
  }

  reset (): void {
    this._alpha = NaN;
    this._origCanvasPos.reset();
    this._canvasPos.reset();
  }

  [Symbol.toPrimitive] (hint: 'string' | 'number' | 'default') {
    switch (hint) {
    case 'string':
    case 'default':
      return `modelPos(${posToPrimitive(this, hint)}):value(${this.value}):origCanvasPos(${this._origCanvasPos}):canvasPos(${this._canvasPos})`;
    case 'number':
      return NaN;
    }
  }

  posEquals (that: IPosition): boolean {
    const equality = posEqual(this, that);
    return equality;
  }
}
