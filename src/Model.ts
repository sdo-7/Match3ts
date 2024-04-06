import type {ISize} from './Size.ts';
import type {IPosition} from './Position.ts';
import type GameElement from './GameElement.ts';
import type {GetNextValue} from './Model/Field.ts';
import type View from './View.ts';
import SwapChange from './Changes/SwapChange.js';
import ModelImpl from './Model/ModelImpl.js';

export {GetNextValue};

export default class Model implements ISize {
  private _impl: ModelImpl;

  constructor (width: number,
               height: number,
               matchLength: number,
               getNextValue: GetNextValue) {
    this._impl = new ModelImpl(width, height, matchLength, getNextValue);
  }

  get width () {
    return this._impl.field.width;
  }

  get height () {
    return this._impl.field.height;
  }

  get change () {
    return this._impl.changes.current;
  }

  set view (view: View | null | undefined) {
    view = view ?? null;

    if (this._impl.view === view)
      return;

    if (this._impl.view) {
      const curView = this._impl.view;
      this._impl.view = null;
      curView.model = null;
    }

    if (!view)
      return;

    this._impl.view = view;
    view.model = this;
  }

  [Symbol.iterator] () {
    return this._impl.field[Symbol.iterator]();
  }

  init (): void {
    for (const element of this._impl.field) {
      do {
        const value = this._impl.getNextValue();
        this._impl.field.setAtPos(value, element);
      } while (this._impl.matches.isAnyMatchAtPos(element));
    }
  }

  isValidPos (pos: IPosition): boolean {
    const validity = this._impl.field.isValidPos(pos);
    return validity;
  }

  atPos (pos: IPosition): GameElement | undefined {
    if (!this.isValidPos(pos))
      return;

    const element = this._impl.field.atPos(pos);
    return element;
  }

  swap (apos: IPosition, bpos: IPosition): void {
    const a = this._impl.field.atPos(apos);
    const b = this._impl.field.atPos(bpos);
    const swapChange = new SwapChange(this._impl, a, b);

    this._impl.changes.current = swapChange;
  }
}
