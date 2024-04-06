import type {IPosition} from '../Position.ts';
import type Animation from '../Animations/Animation.ts';
import type {GameElementGenerator} from '../GameElement.ts';
import type {GetNextValue} from '../Model/Field.ts';
import type ModelImpl from '../Model/ModelImpl.ts';
import LinearAnimation, {LinearAnimationOptions} from '../Animations/LinearAnimation.js';
import GameElement from '../GameElement.js';
import Change from './Change.js';
import MatchChange from './MatchChange.js';

export default class MoveDownChange extends Change {
  private _actionElements: Set<GameElement>;

  constructor (modelImpl: ModelImpl, matchedElements: Set<GameElement>) {
    super(modelImpl);
    this._actionElements = matchedElements;
  }

  contains (pos: IPosition): boolean {
    const element = this._modelImpl.field.atPos(pos);
    const contains = this._actionElements.has(element);
    return contains;
  }

  apply (): void {
    this._modelImpl.field.setAtPoses(null, ...this._actionElements);
    this._moveDown();
    this._fillBlanks(this._modelImpl.getNextValue);
  }

  createAnimation (speed: number): Animation {
    const arg = {
      prevValue: 0,
    };
    const options: LinearAnimationOptions = {
      speed,
      start: 0,
      end: Infinity,
      thisArg: this,
      arg,
      onUpdate: this._onAnimationUpdate,
      onFinish: this._onAnimationFinish,
    };
    const animation = new LinearAnimation(options);
    return animation;
  }

  createNextChange (): Change | undefined {
    const newMatchedElements = new Set(this._modelImpl.matches.getAllMatches());
    if (newMatchedElements.size === 0)
      return;

    const change = new MatchChange(this._modelImpl, newMatchedElements);
    return change;
  }

  protected override *_getElements (): GameElementGenerator {
    yield* this._actionElements;
  }

  private _onAnimationUpdate (value: number, arg: any, animation: Animation) {
    const delta = arg.prevValue - value;
    arg.prevValue = value;

    const notFinishedElements: Set<GameElement> = new Set();

    for (const element of this._actionElements) {
      element.canvasPos.y -= delta;

      if (element.canvasPos.y < element.origCanvasPos.y) {
        notFinishedElements.add(element);
        continue;
      }

      element.canvasPos.y = element.origCanvasPos.y;
    }

    this._actionElements = notFinishedElements;

    if (notFinishedElements.size === 0)
      animation.cancel();
  }

  private _moveDown (): void {
    const movedElements: Set<GameElement> = new Set();
    const cellHeight = this._modelImpl.view?.cellHeight ?? NaN;

    for (let x = 0; x < this._modelImpl.field.width; ++x) {
      let distance = 0;

      for (let y = this._modelImpl.field.height - 1; y >= 0; --y) {
        const srcElement = this._modelImpl.field.at(x, y);
        const srcValue = srcElement.value;

        if (srcValue === null) {
          ++distance;
          continue;
        }
        if (!distance)
          continue;

        const dstElement = this._modelImpl.field.at(x, y+distance);

        this._modelImpl.field.setAtPos(srcValue, dstElement);
        dstElement.canvasPos.fromPos(srcElement.canvasPos);
        movedElements.add(dstElement);
      }

      const span = distance * cellHeight;
      for (let y = 0; y < distance; ++y) {
        const element = this._modelImpl.field.at(x, y);

        this._modelImpl.field.setAtPos(null, element);
        element.canvasPos.y -= span;
        movedElements.add(element);
      }
    }

    this._actionElements = movedElements;
  }

  private _fillBlanks (getNextValue: GetNextValue): void {
    const blankPredicate = (element: GameElement) => element.value === null;
    const blanks = [...this._modelImpl.field].filter(blankPredicate);

    for (const element of blanks)
      this._modelImpl.field.setAtPos(getNextValue(), element);
  }
}
