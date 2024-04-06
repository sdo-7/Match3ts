import type Animation from '../Animations/Animation.ts';
import type ViewImpl from './ViewImpl.js';

export const AnimationSpeed = 500;

export default class Animations {
  private _animations: Animation[];

  constructor (private _impl: ViewImpl) {
    this._animations = [];
  }

  reset (): void {
    for (const animation of this._animations)
      animation.cancel();
    this._animations.length = 0;
  }

  push (a: Animation | null | undefined): void {
    if (!a)
      return;

    this._animations.push(a);
  }

  update (dt: number): void {
    for (const a of this._animations) {
      if (!a.done)
        a.update(dt);

      if (a.done)
        a.finish();
    }

    const notDonePredicate = (e: Animation) => !e.done;
    this._animations = this._animations.filter(notDonePredicate);
  }
}
