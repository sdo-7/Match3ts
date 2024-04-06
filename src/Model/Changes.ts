import type Change from '../Changes/Change.ts';

export default class Changes {
  private _current: Change | null;

  constructor () {
    this._current = null;
  }

  get empty () {
    const empty = !this._current;
    return empty;
  }

  get current () {
    return this._current;
  }

  set current (newCurrent: Change | null | undefined) {
    this._current = newCurrent ?? null;
  }

  startNext (): void {
    this.current = this.current!.createNextChange();
  }
}
