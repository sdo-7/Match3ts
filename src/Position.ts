import {tonumber, notnan} from './Numbers.js';

export interface IPosition {
  x: number;
  y: number;
}

export default class Position implements IPosition {
  x: number;
  y: number;

  constructor ();
  constructor (x: number, y: number);
  constructor (that: IPosition);
  constructor (x?: any, y?: number) {
    const posProvided = (x !== undefined) && (typeof x !== 'number');
    if (posProvided)
      [x, y] = [x.x, x.y];

    this.x = tonumber(x);
    this.y = tonumber(y);
  }

  get validity (): boolean {
    const validity = isValidPos(this);
    return validity;
  }

  [Symbol.toPrimitive] (hint: 'string' | 'number' | 'default') {
    const value = posToPrimitive(this, hint);
    return value;
  }

  setPos (x: number, y: number): void {
    this.x = tonumber(x);
    this.y = tonumber(y);
  }

  fromPos (that: IPosition): void {
    copyPosFromTo(that, this);
  }

  swapPos (that: IPosition): void {
    [this.x, that.x] = [that.x, this.x];
    [this.y, that.y] = [that.y, this.y];
  }

  reset (): void {
    resetPos(this);
  }

  posEquals (that: IPosition): boolean {
    const equality = posEqual(this, that);
    return equality;
  }

  add (that: IPosition): void {
    addPosition(that, this);
  }

  sub (that: IPosition): void {
    subPosition(that, this);
  }
}

export function isValidPos (pos: IPosition): boolean {
  const validity = notnan(pos.x) &&
                   notnan(pos.y);
  return validity;
}

export function copyPosFromTo (from: IPosition, to: IPosition): void {
  to.x = tonumber(from.x);
  to.y = tonumber(from.y);
}

export function resetPos (pos: IPosition): void {
  pos.x = NaN;
  pos.y = NaN;
}

export function posEqual (a: IPosition, b: IPosition): boolean {
  const equality = a.x === b.x &&
                   a.y === b.y;
  return equality;
}

export function addPosition (from: IPosition, to: IPosition): void {
  to.x += tonumber(from.x);
  to.y += tonumber(from.y);
}

export function subPosition (from: IPosition, to: IPosition): void {
  to.x -= tonumber(from.x);
  to.y -= tonumber(from.y);
}

export function posToPrimitive (pos: IPosition, hint: 'string' | 'number' | 'default' = 'default') {
  switch (hint) {
    case 'string':
    case 'default':
      return `${pos.x}:${pos.y}`;
    case 'number':
      return NaN;
  }
}
