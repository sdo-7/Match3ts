import type {IPosition} from '../Position.ts';
import type {GameElementGenerator} from '../GameElement.ts';
import type Animation from '../Animations/Animation.ts';
import type ModelImpl from '../Model/ModelImpl.ts';

export default class Change {
  constructor (protected _modelImpl: ModelImpl) {
  }

  get elements () {
    return this._getElements();
  }

  contains (pos: IPosition): boolean {
    return false;
  }

  apply (): void {
  }

  finish (): void {
    this._modelImpl.changes.startNext();
  }

  createAnimation (animationSpeed: number): Animation | undefined {
    return;
  }

  createNextChange (): Change | undefined {
    return;
  }

  protected *_getElements (): GameElementGenerator {
  }

  protected _onAnimationFinish (): void {
    this.finish();
  }
}
