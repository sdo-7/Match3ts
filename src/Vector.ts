import type {IPosition} from './Position.ts';
import {notnan, tonumber} from './Numbers.js';
import Position from './Position.js';

export type VectorVariable = keyof IPosition;

export default class Vector extends Position {
  length: number;
  variable?: VectorVariable;

  constructor ();
  constructor (x: number,        y: number);
  constructor (x: number,        y: number,      length: number,          variable: VectorVariable);
  constructor (start: IPosition, end: IPosition, variable: VectorVariable);
  constructor (a?: any,          b?: any,        c: any = NaN,            d?: VectorVariable) {
    const xyProvided = (a === undefined) || (typeof a === 'number');
    if (xyProvided) {
      super(a!, b!);
      this.length = tonumber(c);
    } else {
      const startPos = a as IPosition;
      const endPos   = b as IPosition;
      d = c as VectorVariable;

      super(startPos);
      this.length = endPos[d] - startPos[d] + 1;

      if (this.length < 1)
        throw new RangeError(`End (${endPos}) cannot be less than start (${startPos})`);
    }
    this.variable = d;
  }

  get validity (): boolean {
    const validity = super.validity &&
                     notnan(this.length) &&
                     this.variable !== undefined;
    return validity;
  }

  [Symbol.toPrimitive] (hint: 'string' | 'number' | 'default') {
    switch (hint) {
      case 'string':
      case 'default':
        return `${super[Symbol.toPrimitive](hint)}:${this.length}:${this.variable}`;
      case 'number':
        return NaN;
    }
  }

  *[Symbol.iterator] (): Generator<Position, undefined, undefined> {
    if (!this.validity)
      return;

    for (let i = 0; i < this.length; ++i) {
      const pos = new Position(this);
      pos[this.variable!] += i;

      yield pos;
    }
  }

  reset (): void {
    super.reset();
    this.length = NaN;
    this.variable = undefined;
  }
}
