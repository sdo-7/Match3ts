import type {IPosition} from '../../Position.ts';
import type Animation from '../../Animations/Animation.ts';
import type {GameElementGenerator} from '../../GameElement.ts';
import type {NewState} from './StateMachine.ts';
import type Impl from '../ViewImpl.ts';
import Position from '../../Position.js';
import {AnimationSpeed} from '../Animations.js';
import LinearAnimation, {LinearAnimationOptions} from '../../Animations/LinearAnimation.js';
import {MouseButtonToHandle, MouseButtonToHandleMask} from '../MouseHandler.js';
import StateHandler from './StateHandler.js';

// TODO make restoring through animation... or not
// TODO remake mouse leave/enter handling?
export default class SwapStateHandler extends StateHandler {
  private _animation: Animation | null;
  private _swapEnqueued: boolean;

  constructor (private _impl: Impl) {
    super();
    this._updateRequired = true;
    this._animation = null;
    this._swapEnqueued = false;
  }

  private get _first () {
    return this._impl.elements.first;
  }

  private get _second () {
    return this._impl.elements.second;
  }

  private get _a () {
    return this._impl.elements.first.element;
  }

  private get _b () {
    return this._impl.elements.second.element;
  }

  onEnable (): void {
    this._startAnimation();
  }

  onDisable (): void {
    this._second.reset();
  }

  onMouseUp (e: MouseEvent, mousePos: IPosition): NewState {
    if (e.button !== MouseButtonToHandle)
      return;

    if (this._animation)
      this._swapEnqueued = true;
    else {
      this._makeSwap(this._a, this._b!);
      return 'change';
    }
  }

  onMouseMove (e: MouseEvent, mousePos: IPosition): NewState {
    if (!(e.buttons & MouseButtonToHandleMask)) {
      this._animation?.cancel();
      return 'idle';
    }

    const overFirst = this._impl.calculations.isPosInCell(mousePos, this._a.origCanvasPos);
    if (overFirst) {
      this._animation?.cancel();
      return 'mouse';
    }
  }

  isElementInAction (modelPos: IPosition): boolean {
    const inAction = this._a.posEquals(modelPos) ||
                     this._b!.posEquals(modelPos);
    return inAction;
  }

  *getActionElements (): GameElementGenerator {
    yield this._b!;
    yield this._a;
  }

  private _makeSwap (a: IPosition, b: IPosition): void {
    this._impl.model!.swap(a, b);
  }

  private _startAnimation (): void {
    const varName = this._first.delta.x ? 'x' : 'y';
    const curValue = this._first.delta[varName];
    const endValue = this._b!.origCanvasPos[varName] - this._a.origCanvasPos[varName];

    const arg = {
      varName,
      delta: new Position(this._first.delta),
      a: this._a,
      b: this._b,
    };
    const options: LinearAnimationOptions = {
      speed: AnimationSpeed,
      start: curValue,
      end: endValue,
      thisArg: this,
      arg,
      onUpdate: this._onAnimationUpdate,
      onFinish: this._onAnimationFinish
    };
    this._animation = new LinearAnimation(options);
    this._impl.animations.push(this._animation);
  }

  private _onAnimationUpdate (value: number, arg: any, animation: Animation): void {
    arg.delta[arg.varName] = value;

    arg.a.canvasPos.fromPos(arg.a.origCanvasPos);
    arg.a.canvasPos.add(arg.delta);

    arg.b.canvasPos.fromPos(arg.b.origCanvasPos);
    arg.b.canvasPos.sub(arg.delta);
  }

  private _onAnimationFinish (arg: any): void {
    if (this._swapEnqueued) {
      this._swapEnqueued = false;
      arg.a.canvasPos.fromPos(arg.a.origCanvasPos);
      arg.b.canvasPos.fromPos(arg.b.origCanvasPos);
      this._makeSwap(arg.a, arg.b);
      this._impl.stateMachine.current = 'change';
    }

    this._animation = null;
  }
}
