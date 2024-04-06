import type {IPosition} from '../Position.ts';
import type {ISize} from '../Size.ts';
import {isnan} from '../Numbers.js'
import {isValidPos} from '../Position.js';
import GameElement, {Value} from '../GameElement.js';

export type GetNextValue = () => Value;

export default class Field implements ISize {
  private _width: number;
  private _height: number;
  private _data: Value[];
  private _elements: GameElement[];

  constructor (width: number, height: number) {
    if (isnan(width) || isnan(height))
      throw new TypeError(`Cannot create the field. Some dimension is invalid (width: ${width}, height: ${height}).`);
    if (width <= 0 || height <= 0)
      throw new RangeError(`Cannot create the field. Some dimension is invalid (width: ${width}, height: ${height}).`);

    this._width = width;
    this._height = height;

    this._data = new Array(width * height);
    this._data.fill(null);

    this._elements = new Array(this._data.length);
    for (let y = 0; y < this._height; ++y) {
      for (let x = 0; x < this._width; ++x) {
        const offset = this._toOffset(x, y);
        this._elements[offset] = new GameElement(x, y, this._data, offset);
      }
    }
  }

  get width () {
    return this._width;
  }

  get height () {
    return this._height;
  }

  [Symbol.iterator] () {
    return this._elements[Symbol.iterator]();
  }

  at (x: number, y: number): GameElement {
    const offset = this._toOffset_safe(x, y);
    const element = this._elements[offset];
    return element;
  }

  atPos (pos: IPosition): GameElement {
    const element = this.at(pos.x, pos.y);
    return element;
  }

  *atPoses (...poses: IPosition[]): Generator<GameElement> {
    for (const pos of poses) {
      const element = this.atPos(pos);
      yield element;
    }
  }

  setAt (value: Value, x: number, y: number): void {
    const offset = this._toOffset_safe(x, y);
    this._data[offset] = value;
  }

  setAtPos (value: Value, pos: IPosition): void {
    this.setAt(value, pos.x, pos.y);
  }

  setAtPoses (value: Value, ...poses: IPosition[]): void {
    for (const pos of poses)
      this.setAt(value, pos.x, pos.y);
  }

  isValidPos (pos: IPosition): boolean {
    if (!isValidPos(pos))
      return false;

    if (pos.x < 0 || pos.x >= this._width ||
        pos.y < 0 || pos.y >= this._height)
      return false;

    return true;
  }

  swap (aPos: IPosition, bPos: IPosition): void {
    const a = this._toOffset_safe(aPos.x, aPos.y);
    const b = this._toOffset_safe(bPos.x, bPos.y);
    const d = this._data;

    [d[a], d[b]] = [d[b], d[a]];
  }

  private _assertPosition (x: number, y: number): void {
    if (isnan(x) || isnan(y))
      throw new TypeError(`Dimensions (${x} : ${y}) have invalid types.`);

    if (x < 0 || x >= this._width ||
        y < 0 || y >= this._height)
      throw new RangeError(`Dimensions (${x} : ${y}) are out of range.`);
  }

  private _toOffset_safe (x: number, y: number): number {
    this._assertPosition(x, y);
    const offset = this._toOffset(x, y);
    return offset;
  }

  private _toOffset (x: number, y: number): number {
    const offset = this._width * y + x;
    return offset;
  }
}
