import type {AnimationOptions} from './Animation.ts';
import Animation from './Animation.js';

export interface LinearAnimationOptions extends AnimationOptions {
  speed: number;
  start: number;
  end: number;
}

export default class LinearAnimation extends Animation {
  private _speed: number;
  private _end: number;

  constructor (options: LinearAnimationOptions) {
    super(options.start,
          options.thisArg,
          options.arg,
          options.onUpdate,
          options.onFinish);
    this._speed = options.speed;
    this._end = options.end;
  }

  update (td: number): void {
    if (this.done)
      return;

    this._calcCurrent(td);
    this.done = (this._current === this._end);
    this._callOnUpdate();
  }

  private _calcCurrent (td: number): void {
    if (this.done)
      return;

    const sign = this._end < this._current ? -1 : 1;
    const timePercent = td / 1000;
    const delta = timePercent * this._speed;

    this._current += delta * sign;
    if ((sign ===  1 && this._current > this._end) ||
        (sign === -1 && this._current < this._end))
      this._current = this._end;
  }
}
