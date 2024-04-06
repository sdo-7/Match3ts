import type {IPosition} from '../Position.ts';
import type {GameElementGenerator} from '../GameElement.ts';
import type Animation from '../Animations/Animation.ts';
import type ModelImpl from '../Model/ModelImpl.ts';
import Position from '../Position.js';
import GameElement from '../GameElement.js';
import LinearAnimation, {LinearAnimationOptions} from '../Animations/LinearAnimation.js';
import Change from './Change.js';
import MatchChange from './MatchChange.js';

export default class SwapChange extends Change {
  private _a: GameElement;
  private _b: GameElement;
  private _matchedElements: Set<GameElement>;

  constructor (modelImpl: ModelImpl, a: GameElement, b: GameElement) {
    super(modelImpl);
    this._a = a;
    this._b = b;
  }

  get a () {
    return this._a;
  }

  get b () {
    return this._b;
  }

  contains (pos: IPosition): boolean {
    const contains = this._a.posEquals(pos) ||
                     this._b.posEquals(pos);
    return contains;
  }

  apply (): void {
    this._modelImpl.field.swap(this._a, this._b);

    this._matchedElements = new Set(this._modelImpl.matches.getMatchesAtPoses(this._a, this._b));

    const noMatches = this._matchedElements.size === 0;
    if (noMatches) {
      this._modelImpl.field.swap(this._a, this._b);
      this._a.canvasPos.swapPos(this._b.canvasPos);
      this.createAnimation = this._createAnimation;
    } else {
      this.createNextChange = this._createNextChange;
      this.finish();
    }
  }

  protected override *_getElements (): GameElementGenerator {
    yield this._b;
    yield this._a;
  }

  private _createAnimation (speed: number): Animation {
    const varName = (this._a.x !== this._b.x) ? 'x' : 'y';
    const start = (this._a.canvasPos[varName] - this._b.canvasPos[varName]);

    const arg = {
      varName,
      delta: new Position(0, 0),
    };
    const options: LinearAnimationOptions = {
      speed,
      start,
      end: 0,
      thisArg: this,
      arg,
      onUpdate: this._onAnimationUpdate,
      onFinish: this._onAnimationFinish,
    };
    arg.delta[varName] = options.start;
    const animation = new LinearAnimation(options);
    return animation;
  }

  private _createNextChange (): Change {
    const change = new MatchChange(this._modelImpl, this._matchedElements);
    return change;
  }

  private _calcFromDelta (delta: IPosition): void {
    this._a.canvasPos.fromPos(this._a.origCanvasPos);
    this._b.canvasPos.fromPos(this._b.origCanvasPos);

    this._a.canvasPos.add(delta);
    this._b.canvasPos.sub(delta);
  }

  private _onAnimationUpdate (value: number, arg: any): void {
    arg.delta[arg.varName] = value;
    this._calcFromDelta(arg.delta);
  }
}
