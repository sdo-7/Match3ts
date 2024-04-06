import type {IPosition} from '../../Position.ts';
import type {GameElementGenerator} from '../../GameElement.ts';
import type {NewState} from './StateMachine.ts';
import type Change from '../../Changes/Change.ts';
import type Impl from '../ViewImpl.ts';
import {AnimationSpeed} from '../Animations.js';
import StateHandler from './StateHandler.js';

export default class ChangeStateHandler extends StateHandler {
  private _current: Change | null;

  constructor (private _viewImpl: Impl) {
    super();
    this._updateRequired = true;
    this._current = null;
  }

  onEnable (): void {
    this._current = this._next!;
    this._current.apply();

    const animation = this._current.createAnimation(AnimationSpeed) ?? null;
    this._viewImpl.animations.push(animation);
  }

  onDisable (): void {
    this._current = null;
  }

  private get _next () {
    const change = this._viewImpl.model!.change;
    return change;
  }

  update (): NewState {
    const done = this._next !== this._current;
    if (done)
      return 'idle';
  }

  isElementInAction (modelPos: IPosition): boolean {
    const inAction = this._next!.contains(modelPos);
    return inAction;
  }

  *getActionElements (): GameElementGenerator {
    yield* this._next!.elements;
  }
}
