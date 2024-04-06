import type {IPosition} from '../Position.ts';
import type Animation from '../Animations/Animation.ts';
import type {GameElementGenerator} from '../GameElement.ts';
import type ModelImpl from '../Model/ModelImpl.ts';
import LinearAnimation, {LinearAnimationOptions} from '../Animations/LinearAnimation.js';
import GameElement from '../GameElement.js';
import Change from './Change.js';
import MoveDownChange from './MoveDownChange.js';

export default class MatchChange extends Change {
  private _matchedElements: Set<GameElement>;

  constructor (modelImpl: ModelImpl, matchedElements: Set<GameElement>) {
    super(modelImpl);
    this._matchedElements = matchedElements;
  }

  contains (pos: IPosition): boolean {
    const element = this._modelImpl.field.atPos(pos);
    const contains = this._matchedElements.has(element);
    return contains;
  }

  apply (): void {
  }

  createAnimation (speed: number): Animation {
    const options: LinearAnimationOptions = {
      speed,
      start: 100,
      end: 0,
      thisArg: this,
      onUpdate: this._onAnimationUpdate,
      onFinish: this._onAnimationFinish,
    };

    const animation = new LinearAnimation(options);
    return animation;
  }

  createNextChange (): Change {
    const change = new MoveDownChange(this._modelImpl, this._matchedElements);
    return change;
  }

  protected override *_getElements (): GameElementGenerator {
    yield* this._matchedElements;
  }

  protected _onAnimationFinish (): void {
    this._setAlpha(100);
    super._onAnimationFinish();
  }

  private _setAlpha (value: number): void {
    for (const element of this._matchedElements)
      element.alpha = value;
  }

  private _onAnimationUpdate (value: number): void {
    this._setAlpha(value);
  }
}
